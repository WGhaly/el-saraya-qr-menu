import express from 'express';
import { productController } from '../controllers/product.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = express.Router();

// Public routes (for menu display)
router.get('/featured', productController.getFeatured);

// Protected admin routes
router.get('/', authenticateToken, requireAdmin, productController.getAll);
router.get('/:id', authenticateToken, requireAdmin, productController.getById);
router.post('/', authenticateToken, requireAdmin, productController.create);
router.put('/:id', authenticateToken, requireAdmin, productController.update);
router.delete('/:id', authenticateToken, requireAdmin, productController.delete);

export { router as productRoutes };