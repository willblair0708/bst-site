import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

router.get('/', asyncHandler(async (req: any, res: any) => {
  const { prisma } = req;
  const packages = await prisma.package.findMany({
    where: { isPublic: true }
  });
  res.json({ packages });
}));

export default router;