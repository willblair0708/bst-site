import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';
import type { PassportStatic } from 'passport';

export const setupPassport = (passport: PassportStatic, prisma: PrismaClient) => {
  // JWT Strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
  }, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          repositories: true,
          collaborations: {
            include: {
              repository: true
            }
          }
        }
      });

      if (user && user.isActive) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));

  // GitHub OAuth Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
      scope: ['user:email', 'repo']
    }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { githubId: profile.id }
        });

        if (user) {
          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          });
        } else {
          // Create new user
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in GitHub profile'), null);
          }

          // Check if email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email }
          });

          if (existingUser) {
            // Link GitHub account to existing user
            user = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                githubId: profile.id,
                avatar: profile.photos?.[0]?.value,
                lastLogin: new Date()
              }
            });
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                email,
                username: profile.username,
                name: profile.displayName || profile.username,
                githubId: profile.id,
                avatar: profile.photos?.[0]?.value,
                lastLogin: new Date()
              }
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          repositories: true,
          collaborations: {
            include: {
              repository: true
            }
          }
        }
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};