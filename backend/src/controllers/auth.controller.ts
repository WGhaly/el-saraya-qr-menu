import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authConfig } from '../config';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const authController = {
  // Login
  login: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        authConfig.jwtSecret,
        { expiresIn: authConfig.jwtExpiresIn } as jwt.SignOptions
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        authConfig.jwtRefreshSecret,
        { expiresIn: authConfig.jwtRefreshExpiresIn } as jwt.SignOptions
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Refresh token
  refreshToken: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const decoded = jwt.verify(refreshToken, authConfig.jwtRefreshSecret) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        authConfig.jwtSecret,
        { expiresIn: authConfig.jwtExpiresIn } as jwt.SignOptions
      );

      res.json({
        success: true,
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          }
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  },

  // Get current user
  me: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Change password
  changePassword: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          password: true,
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get all users (admin only)
  getUsers: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        });
      }

      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: { users }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Create new user (admin only)
  createUser: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, password, firstName, lastName, role = 'ADMIN' } = req.body;

      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        });
      }

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: firstName || '',
          lastName: lastName || '',
          role: role,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        }
      });

      res.status(201).json({
        success: true,
        data: { user },
        message: 'User created successfully'
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Reset user password (admin only)
  resetUserPassword: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId, newPassword } = req.body;

      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        });
      }

      if (!userId || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'User ID and new password are required'
        });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      res.json({
        success: true,
        message: 'User password reset successfully'
      });
    } catch (error) {
      console.error('Reset user password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Deactivate user (admin only)
  deactivateUser: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.params;

      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        });
      }

      // Don't allow deactivating self
      if (req.user.id === userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own account'
        });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Deactivate user
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false }
      });

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Deactivate user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Logout
  logout: async (req: AuthenticatedRequest, res: Response) => {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};