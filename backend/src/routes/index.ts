import express from 'express';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { productRoutes } from './product.routes';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export { router as apiRoutes };