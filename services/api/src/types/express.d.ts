import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import pino from 'pino';

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      redis: ReturnType<typeof createClient>;
      logger: pino.Logger;
      user?: {
        id: string;
        email: string;
        username: string;
        name: string;
        avatar?: string;
        role: string;
        lastLogin?: Date;
        createdAt: Date;
      };
    }

    interface User {
      id: string;
      email: string;
      username: string;
      name: string;
      avatar?: string;
      role: string;
      lastLogin?: Date;
      createdAt: Date;
    }
  }
}
