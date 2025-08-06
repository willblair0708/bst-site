import express from 'express';
import passport from 'passport';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

// Get all users (admin only)
router.get('/', requireAuth, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma, user } = req as any;
  
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLogin: true
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ users });
}));

// Get user profile
router.get('/:username', requireAuth, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma } = req as any;
  const { username } = req.params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          repositories: true,
          collaborations: true
        }
      }
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
}));

export default router;