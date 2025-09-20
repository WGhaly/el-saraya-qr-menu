import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      console.error('Role validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Pre-defined role checkers
export const requireAdmin = requireRole(['SUPER_ADMIN', 'ADMIN', 'MANAGER']);
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);