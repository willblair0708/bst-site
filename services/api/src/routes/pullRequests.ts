import express from 'express';
import passport from 'passport';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, asyncHandler(async (req: any, res: any) => {
  const { prisma } = req;
  const pullRequests = await prisma.pullRequest.findMany({
    include: {
      author: { select: { username: true, name: true, avatar: true } },
      repository: { select: { name: true, slug: true } }
    }
  });
  res.json({ pullRequests });
}));

export default router;