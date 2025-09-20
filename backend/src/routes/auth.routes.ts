import express from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', authenticateToken, authController.me);
router.post('/change-password', authenticateToken, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);

// Admin only routes
router.get('/users', authenticateToken, authController.getUsers);
router.post('/users', authenticateToken, authController.createUser);
router.post('/users/reset-password', authenticateToken, authController.resetUserPassword);
router.patch('/users/:userId/deactivate', authenticateToken, authController.deactivateUser);

export { router as authRoutes };