import express from 'express';
import passport from 'passport';
import { body, param, query, validationResult } from 'express-validator';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Middleware to require authentication
const requireAuth = passport.authenticate('jwt', { session: false });

// Get all repositories for the authenticated user
router.get('/', requireAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('type').optional().isIn(['owned', 'collaborated', 'public']),
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { prisma, user } = req as any;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search;
  const type = req.query.type || 'all';
  const offset = (page - 1) * limit;

  let whereClause: any = {};

  // Filter by type
  if (type === 'owned') {
    whereClause.ownerId = user.id;
  } else if (type === 'collaborated') {
    whereClause.collaborators = {
      some: {
        userId: user.id
      }
    };
  } else if (type === 'public') {
    whereClause.isPrivate = false;
  } else {
    // All accessible repositories
    whereClause.OR = [
      { ownerId: user.id },
      { collaborators: { some: { userId: user.id } } },
      { isPrivate: false }
    ];
  }

  // Add search filter
  if (search) {
    whereClause.AND = [
      whereClause,
      {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
    ];
  }

  const [repositories, total] = await Promise.all([
    prisma.repository.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            protocols: true,
            pullRequests: true,
            collaborators: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.repository.count({ where: whereClause })
  ]);

  res.json({
    repositories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}));

// Get a specific repository
router.get('/:id', requireAuth, [
  param('id').isUUID()
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { prisma, user } = req as any;
  const { id } = req.params;

  const repository = await prisma.repository.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } },
        { isPrivate: false }
      ]
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true
        }
      },
      organization: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      collaborators: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      branches: true,
      protocols: {
        take: 10,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          version: true,
          status: true,
          phase: true,
          updatedAt: true
        }
      },
      _count: {
        select: {
          protocols: true,
          pullRequests: true,
          collaborators: true
        }
      }
    }
  });

  if (!repository) {
    throw createError('Repository not found', 404);
  }

  res.json({ repository });
}));

// Create a new repository
router.post('/', requireAuth, [
  body('name').isLength({ min: 1, max: 100 }).matches(/^[a-zA-Z0-9_-]+$/),
  body('description').optional().isLength({ max: 500 }),
  body('isPrivate').optional().isBoolean(),
  body('organizationId').optional().isUUID(),
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { prisma, user } = req as any;
  const { name, description, isPrivate = false, organizationId } = req.body;

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  // Check if repository with same slug already exists for user/org
  const existingRepo = await prisma.repository.findFirst({
    where: {
      slug,
      ...(organizationId ? { organizationId } : { ownerId: user.id, organizationId: null })
    }
  });

  if (existingRepo) {
    throw createError('Repository with this name already exists', 409);
  }

  // Create repository
  const repository = await prisma.repository.create({
    data: {
      name,
      slug,
      description,
      isPrivate,
      ownerId: user.id,
      organizationId,
      gitUrl: `git@bastion:${organizationId ? `${organizationId}/${slug}` : `${user.username}/${slug}`}.git`,
      defaultBranch: 'main'
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true
        }
      },
      organization: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });

  // Create default main branch
  await prisma.branch.create({
    data: {
      name: 'main',
      repositoryId: repository.id,
      commitSha: '0000000000000000000000000000000000000000',
      isProtected: true
    }
  });

  res.status(201).json({
    repository,
    message: 'Repository created successfully'
  });
}));

// Update repository
router.put('/:id', requireAuth, [
  param('id').isUUID(),
  body('name').optional().isLength({ min: 1, max: 100 }).matches(/^[a-zA-Z0-9_-]+$/),
  body('description').optional().isLength({ max: 500 }),
  body('isPrivate').optional().isBoolean(),
  body('defaultBranch').optional().isString(),
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { prisma, user } = req as any;
  const { id } = req.params;
  const updates = req.body;

  // Check repository ownership or admin permission
  const repository = await prisma.repository.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user.id },
        { 
          collaborators: { 
            some: { 
              userId: user.id, 
              permission: 'admin' 
            } 
          } 
        }
      ]
    }
  });

  if (!repository) {
    throw createError('Repository not found or insufficient permissions', 404);
  }

  // Update repository
  const updatedRepository = await prisma.repository.update({
    where: { id },
    data: updates,
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true
        }
      },
      organization: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });

  res.json({
    repository: updatedRepository,
    message: 'Repository updated successfully'
  });
}));

// Delete repository
router.delete('/:id', requireAuth, [
  param('id').isUUID()
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { prisma, user } = req as any;
  const { id } = req.params;

  // Check repository ownership
  const repository = await prisma.repository.findFirst({
    where: {
      id,
      ownerId: user.id
    }
  });

  if (!repository) {
    throw createError('Repository not found or insufficient permissions', 404);
  }

  // Delete repository (cascades to related records)
  await prisma.repository.delete({
    where: { id }
  });

  res.json({
    message: 'Repository deleted successfully'
  });
}));

// Manage repository collaborators
router.post('/:id/collaborators', requireAuth, [
  param('id').isUUID(),
  body('username').isString(),
  body('permission').isIn(['read', 'write', 'admin']),
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { prisma, user } = req as any;
  const { id } = req.params;
  const { username, permission } = req.body;

  // Check repository ownership or admin permission
  const repository = await prisma.repository.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user.id },
        { 
          collaborators: { 
            some: { 
              userId: user.id, 
              permission: 'admin' 
            } 
          } 
        }
      ]
    }
  });

  if (!repository) {
    throw createError('Repository not found or insufficient permissions', 404);
  }

  // Find user to add as collaborator
  const collaboratorUser = await prisma.user.findUnique({
    where: { username }
  });

  if (!collaboratorUser) {
    throw createError('User not found', 404);
  }

  // Add or update collaborator
  await prisma.repositoryCollaborator.upsert({
    where: {
      repositoryId_userId: {
        repositoryId: id,
        userId: collaboratorUser.id
      }
    },
    update: { permission },
    create: {
      repositoryId: id,
      userId: collaboratorUser.id,
      permission
    }
  });

  res.json({
    message: 'Collaborator added successfully'
  });
}));

// Get repository branches
router.get('/:id/branches', requireAuth, [
  param('id').isUUID()
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  const { prisma, user } = req as any;
  const { id } = req.params;

  // Check repository access
  const repository = await prisma.repository.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } },
        { isPrivate: false }
      ]
    }
  });

  if (!repository) {
    throw createError('Repository not found', 404);
  }

  const branches = await prisma.branch.findMany({
    where: { repositoryId: id },
    orderBy: [
      { name: 'asc' }
    ]
  });

  res.json({ branches });
}));

export default router;