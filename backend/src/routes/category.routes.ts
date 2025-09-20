import express from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = express.Router();

// Public routes (for menu display)
router.get('/public', categoryController.getPublic);

// Protected admin routes
router.get('/', authenticateToken, requireAdmin, categoryController.getAll);
router.get('/:id', authenticateToken, requireAdmin, categoryController.getById);
router.post('/', authenticateToken, requireAdmin, categoryController.create);
router.put('/:id', authenticateToken, requireAdmin, categoryController.update);
router.delete('/:id', authenticateToken, requireAdmin, categoryController.delete);

export { router as categoryRoutes };