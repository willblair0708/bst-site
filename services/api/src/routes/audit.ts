import express from 'express';
import passport from 'passport';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma, user } = req as any;
  
  if (user.role !== 'ADMIN' && user.role !== 'REGULATOR') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const auditLogs = await prisma.auditLog.findMany({
    include: {
      user: { select: { username: true, name: true } }
    },
    orderBy: { timestamp: 'desc' },
    take: 100
  });
  
  res.json({ auditLogs });
}));

export default router;