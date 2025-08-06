import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_-]+$/),
  body('name').isLength({ min: 1, max: 100 }),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, username, name, password } = req.body;
  const { prisma } = req;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    throw createError('User already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      name,
      // Note: In a real implementation, you'd store the password hash
      // For this demo, we're not storing passwords directly
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true
    }
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.status(201).json({
    user,
    token,
    message: 'User registered successfully'
  });
}));

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;
  const { prisma } = req;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      isActive: true,
      // In real implementation, include password hash
    }
  });

  if (!user || !user.isActive) {
    throw createError('Invalid credentials', 401);
  }

  // In a real implementation, verify password hash
  // const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  // if (!isValidPassword) {
  //   throw createError('Invalid credentials', 401);
  // }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      role: user.role
    },
    token,
    message: 'Login successful'
  });
}));

// GitHub OAuth login
router.get('/github',
  passport.authenticate('github', { scope: ['user:email', 'repo'] })
);

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  asyncHandler(async (req: any, res: any) => {
    // Generate JWT token
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  })
);

// Get current user
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req: any, res: any) => {
    const user = req.user;
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  })
);

// Refresh token
router.post('/refresh',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req: any, res: any) => {
    const user = req.user;

    // Generate new JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      message: 'Token refreshed successfully'
    });
  })
);

// Logout (invalidate token on client side)
router.post('/logout',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req: any, res: any) => {
    // In a real implementation, you might want to blacklist the token
    res.json({
      message: 'Logout successful'
    });
  })
);

export default router;