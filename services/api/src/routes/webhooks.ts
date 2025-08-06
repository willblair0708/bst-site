import express from 'express';
import passport from 'passport';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, asyncHandler(async (req: any, res: any) => {
  const { prisma } = req;
  const webhooks = await prisma.webhook.findMany();
  res.json({ webhooks });
}));

export default router;