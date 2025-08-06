import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

router.get('/', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma } = req as any;
  const packages = await prisma.package.findMany({
    where: { isPublic: true }
  });
  res.json({ packages });
}));

export default router;