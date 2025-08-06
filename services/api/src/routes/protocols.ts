import express from 'express';
import passport from 'passport';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

// Get protocols
router.get('/', requireAuth, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma } = req as any;
  
  const protocols = await prisma.protocol.findMany({
    include: {
      repository: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  res.json({ protocols });
}));

// Create protocol
router.post('/', requireAuth, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { prisma } = req as any;
  const { name, version, description, type, phase, content, repositoryId } = req.body;

  const protocol = await prisma.protocol.create({
    data: {
      name,
      version,
      description,
      type,
      phase,
      content,
      repositoryId,
      schema: {},
      filePath: `protocols/${name}.yaml`,
      checksum: 'placeholder'
    }
  });

  res.status(201).json({ protocol });
}));

export default router;