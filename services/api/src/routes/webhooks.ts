import express from 'express';
import passport from 'passport';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma } = req as any;
  const webhooks = await prisma.webhook.findMany();
  res.json({ webhooks });
}));

export default router;