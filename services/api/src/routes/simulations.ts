import express from 'express';
import passport from 'passport';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma } = req as any;
  const simulations = await prisma.simulation.findMany({
    include: {
      protocol: { select: { name: true, version: true } }
    }
  });
  res.json({ simulations });
}));

export default router;