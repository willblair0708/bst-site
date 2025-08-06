import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import pino from 'pino';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import repositoryRoutes from './routes/repositories.js';
import protocolRoutes from './routes/protocols.js';
import pullRequestRoutes from './routes/pullRequests.js';
import simulationRoutes from './routes/simulations.js';
import packageRoutes from './routes/packages.js';
import aiRoutes from './routes/ai.js';
import auditRoutes from './routes/audit.js';
import webhookRoutes from './routes/webhooks.js';
import metricsRoutes from './routes/metrics.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { setupPassport } from './config/passport.js';
import { auditLogger } from './middleware/auditLogger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// Initialize database
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Initialize Redis
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => logger.error('Redis Client Error', err));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Passport authentication
setupPassport(passport, prisma);
app.use(passport.initialize());

// Audit logging middleware
app.use(auditLogger(prisma));

// Make services available to routes
app.use((req, res, next) => {
  (req as any).prisma = prisma;
  (req as any).redis = redis;
  (req as any).logger = logger;
  next();
});

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service dependencies unavailable'
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/protocols', protocolRoutes);
app.use('/api/pull-requests', pullRequestRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await prisma.$disconnect();
    await redis.quit();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    // Connect to Redis
    await redis.connect();
    logger.info('Connected to Redis');
    
    // Generate Prisma client
    await prisma.$connect();
    logger.info('Connected to database');
    
    app.listen(port, () => {
      logger.info(`Bastion API server started on port ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

export { app, prisma, redis, logger };