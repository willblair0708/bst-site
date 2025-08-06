import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

export const auditLogger = (prisma: PrismaClient) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip audit logging for health checks and static files
    if (req.path === '/health' || req.path.startsWith('/static')) {
      return next();
    }

    const originalSend = res.send;
    
    res.send = function(data) {
      // Only log successful operations that modify data
      if (res.statusCode >= 200 && res.statusCode < 300 && 
          ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        
        const user = (req as any).user;
        const action = getActionFromRequest(req);
        const resource = getResourceFromRequest(req);
        const resourceId = getResourceIdFromRequest(req);
        
        // Async audit logging (don't block response)
        setImmediate(async () => {
          try {
            await prisma.auditLog.create({
              data: {
                action,
                resource,
                resourceId,
                userId: user?.id,
                metadata: {
                  method: req.method,
                  path: req.path,
                  query: req.query,
                  body: sanitizeBody(req.body),
                  statusCode: res.statusCode,
                  timestamp: new Date().toISOString()
                },
                ipAddress: getClientIP(req),
                userAgent: req.get('User-Agent') || null
              }
            });
          } catch (error) {
            console.error('Failed to create audit log:', error);
          }
        });
      }
      
      return originalSend.call(this, data);
    };

    next();
  };
};

function getActionFromRequest(req: Request): string {
  const method = req.method;
  const path = req.path;

  // Map HTTP methods to actions
  const actionMap: Record<string, string> = {
    'POST': 'CREATE',
    'PUT': 'UPDATE',
    'PATCH': 'UPDATE',
    'DELETE': 'DELETE'
  };

  const baseAction = actionMap[method] || 'UNKNOWN';

  // Specific actions based on paths
  if (path.includes('/pull-requests') && method === 'POST') {
    return 'CREATE_PULL_REQUEST';
  }
  
  if (path.includes('/pull-requests') && path.includes('/merge') && method === 'POST') {
    return 'MERGE_PULL_REQUEST';
  }
  
  if (path.includes('/protocols') && method === 'POST') {
    return 'CREATE_PROTOCOL';
  }
  
  if (path.includes('/simulations') && method === 'POST') {
    return 'START_SIMULATION';
  }
  
  if (path.includes('/deployments') && method === 'POST') {
    return 'DEPLOY_PROTOCOL';
  }

  if (path.includes('/auth/login')) {
    return 'LOGIN';
  }

  if (path.includes('/auth/logout')) {
    return 'LOGOUT';
  }

  return baseAction;
}

function getResourceFromRequest(req: Request): string {
  const path = req.path;

  if (path.includes('/repositories')) return 'REPOSITORY';
  if (path.includes('/protocols')) return 'PROTOCOL';
  if (path.includes('/pull-requests')) return 'PULL_REQUEST';
  if (path.includes('/simulations')) return 'SIMULATION';
  if (path.includes('/packages')) return 'PACKAGE';
  if (path.includes('/users')) return 'USER';
  if (path.includes('/organizations')) return 'ORGANIZATION';
  if (path.includes('/teams')) return 'TEAM';
  if (path.includes('/deployments')) return 'DEPLOYMENT';
  if (path.includes('/webhooks')) return 'WEBHOOK';
  if (path.includes('/auth')) return 'AUTH';

  return 'UNKNOWN';
}

function getResourceIdFromRequest(req: Request): string {
  // Extract ID from URL parameters
  const { id, repositoryId, protocolId, userId, organizationId } = req.params;
  return id || repositoryId || protocolId || userId || organizationId || 'unknown';
}

function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'apiKey',
    'privateKey',
    'clientSecret'
  ];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

function getClientIP(req: Request): string {
  return (
    req.headers['x-forwarded-for'] as string ||
    req.headers['x-real-ip'] as string ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  ).split(',')[0].trim();
}