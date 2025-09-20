import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const categoryController = {
  // Get all categories
  getAll: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { includeInactive } = req.query;
      
      const categories = await prisma.category.findMany({
        where: includeInactive === 'true' ? {} : { isActive: true },
        include: {
          products: {
            where: { isActive: true },
            include: {
              variations: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' }
              }
            },
            orderBy: { sortOrder: 'asc' }
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          updatedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get category by ID
  getById: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            include: {
              variations: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' }
              }
            },
            orderBy: { sortOrder: 'asc' }
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          updatedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Create category
  create: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { 
        nameEn, 
        nameAr, 
        descriptionEn, 
        descriptionAr, 
        imageUrl, 
        isActive = true, 
        sortOrder = 0 
      } = req.body;

      if (!nameEn || !nameAr) {
        return res.status(400).json({
          success: false,
          message: 'Both English and Arabic names are required'
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const category = await prisma.category.create({
        data: {
          nameEn,
          nameAr,
          descriptionEn,
          descriptionAr,
          imageUrl,
          isActive,
          sortOrder,
          createdById: req.user.id,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Create category error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update category
  update: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { 
        nameEn, 
        nameAr, 
        descriptionEn, 
        descriptionAr, 
        imageUrl, 
        isActive, 
        sortOrder 
      } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id }
      });

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const category = await prisma.category.update({
        where: { id },
        data: {
          nameEn,
          nameAr,
          descriptionEn,
          descriptionAr,
          imageUrl,
          isActive,
          sortOrder,
          updatedById: req.user.id,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          updatedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      });

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Update category error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Delete category
  delete: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true
        }
      });

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check if category has products
      if (existingCategory.products.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category with existing products. Remove products first.'
        });
      }

      await prisma.category.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get public categories (for menu display)
  getPublic: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { lang = 'ar' } = req.query; // Default to Arabic

      const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          nameEn: true,
          nameAr: true,
          descriptionEn: true,
          descriptionAr: true,
          imageUrl: true,
          sortOrder: true,
          products: {
            where: { isActive: true },
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
              descriptionEn: true,
              descriptionAr: true,
              basePrice: true,
              imageUrl: true,
              preparationTime: true,
              ingredientsEn: true,
              ingredientsAr: true,
              allergens: true,
              variations: {
                where: { isActive: true },
                select: {
                  id: true,
                  nameEn: true,
                  nameAr: true,
                  type: true,
                  priceModifier: true,
                  isDefault: true,
                },
                orderBy: { sortOrder: 'asc' }
              }
            },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      res.json({
        success: true,
        data: categories,
        language: lang
      });
    } catch (error) {
      console.error('Get public categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};