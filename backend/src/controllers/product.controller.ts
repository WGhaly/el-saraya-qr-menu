import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const productController = {
  // Get all products
  getAll: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { categoryId, includeInactive, featured } = req.query;
      
      const whereClause: any = {};
      
      if (categoryId) {
        whereClause.categoryId = categoryId;
      }
      
      if (includeInactive !== 'true') {
        whereClause.isActive = true;
      }
      
      if (featured === 'true') {
        whereClause.isFeatured = true;
      }

      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
              descriptionEn: true,
              descriptionAr: true,
            }
          },
          variations: {
            where: { isActive: true },
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

      // Parse JSON fields
      const productsWithParsedData = products.map(product => ({
        ...product,
        ingredientsEn: product.ingredientsEn ? JSON.parse(product.ingredientsEn) : [],
        ingredientsAr: product.ingredientsAr ? JSON.parse(product.ingredientsAr) : [],
        allergens: product.allergens ? JSON.parse(product.allergens) : [],
        nutritionInfo: product.nutritionInfo ? JSON.parse(product.nutritionInfo) : null,
      }));

      res.json({
        success: true,
        data: productsWithParsedData
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get product by ID
  getById: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
              descriptionEn: true,
              descriptionAr: true,
            }
          },
          variations: {
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

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Parse JSON fields
      const productWithParsedData = {
        ...product,
        ingredientsEn: product.ingredientsEn ? JSON.parse(product.ingredientsEn) : [],
        ingredientsAr: product.ingredientsAr ? JSON.parse(product.ingredientsAr) : [],
        allergens: product.allergens ? JSON.parse(product.allergens) : [],
        nutritionInfo: product.nutritionInfo ? JSON.parse(product.nutritionInfo) : null,
      };

      res.json({
        success: true,
        data: productWithParsedData
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Create product
  create: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        basePrice,
        imageUrl,
        isActive = true,
        isFeatured = false,
        sortOrder = 0,
        preparationTime,
        ingredientsEn = [],
        ingredientsAr = [],
        allergens = [],
        nutritionInfo,
        categoryId
      } = req.body;

      if (!nameEn || !nameAr || !basePrice || !categoryId) {
        return res.status(400).json({
          success: false,
          message: 'English name, Arabic name, base price, and category ID are required'
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      // Verify category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }

      const product = await prisma.product.create({
        data: {
          nameEn,
          nameAr,
          descriptionEn,
          descriptionAr,
          basePrice: parseFloat(basePrice),
          imageUrl,
          isActive,
          isFeatured,
          sortOrder,
          preparationTime,
          ingredientsEn: JSON.stringify(ingredientsEn),
          ingredientsAr: JSON.stringify(ingredientsAr),
          allergens: JSON.stringify(allergens),
          nutritionInfo: nutritionInfo ? JSON.stringify(nutritionInfo) : null,
          categoryId,
          createdById: req.user.id,
        },
        include: {
          category: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
              descriptionEn: true,
              descriptionAr: true,
            }
          },
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

      // Parse JSON fields for response
      const productWithParsedData = {
        ...product,
        ingredientsEn: product.ingredientsEn ? JSON.parse(product.ingredientsEn) : [],
        ingredientsAr: product.ingredientsAr ? JSON.parse(product.ingredientsAr) : [],
        allergens: product.allergens ? JSON.parse(product.allergens) : [],
        nutritionInfo: product.nutritionInfo ? JSON.parse(product.nutritionInfo) : null,
      };

      res.status(201).json({
        success: true,
        data: productWithParsedData
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update product
  update: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        basePrice,
        imageUrl,
        isActive,
        isFeatured,
        sortOrder,
        preparationTime,
        ingredientsEn,
        ingredientsAr,
        allergens,
        nutritionInfo,
        categoryId
      } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Verify category exists if being updated
      if (categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: categoryId }
        });

        if (!category) {
          return res.status(400).json({
            success: false,
            message: 'Category not found'
          });
        }
      }

      const updateData: any = {
        updatedById: req.user.id,
      };

      if (nameEn !== undefined) updateData.nameEn = nameEn;
      if (nameAr !== undefined) updateData.nameAr = nameAr;
      if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn;
      if (descriptionAr !== undefined) updateData.descriptionAr = descriptionAr;
      if (basePrice !== undefined) updateData.basePrice = parseFloat(basePrice);
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
      if (preparationTime !== undefined) updateData.preparationTime = preparationTime;
      if (ingredientsEn !== undefined) updateData.ingredientsEn = JSON.stringify(ingredientsEn);
      if (ingredientsAr !== undefined) updateData.ingredientsAr = JSON.stringify(ingredientsAr);
      if (allergens !== undefined) updateData.allergens = JSON.stringify(allergens);
      if (nutritionInfo !== undefined) updateData.nutritionInfo = nutritionInfo ? JSON.stringify(nutritionInfo) : null;
      if (categoryId !== undefined) updateData.categoryId = categoryId;

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
              descriptionEn: true,
              descriptionAr: true,
            }
          },
          variations: {
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

      // Parse JSON fields for response
      const productWithParsedData = {
        ...product,
        ingredientsEn: product.ingredientsEn ? JSON.parse(product.ingredientsEn) : [],
        ingredientsAr: product.ingredientsAr ? JSON.parse(product.ingredientsAr) : [],
        allergens: product.allergens ? JSON.parse(product.allergens) : [],
        nutritionInfo: product.nutritionInfo ? JSON.parse(product.nutritionInfo) : null,
      };

      res.json({
        success: true,
        data: productWithParsedData
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Delete product
  delete: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          variations: true
        }
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Delete all variations first (cascade should handle this, but being explicit)
      await prisma.productVariation.deleteMany({
        where: { productId: id }
      });

      // Delete product
      await prisma.product.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get featured products
  getFeatured: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true
        },
        include: {
          category: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
              descriptionEn: true,
              descriptionAr: true,
            }
          },
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
      });

      // Parse JSON fields
      const productsWithParsedData = products.map(product => ({
        ...product,
        ingredientsEn: product.ingredientsEn ? JSON.parse(product.ingredientsEn) : [],
        ingredientsAr: product.ingredientsAr ? JSON.parse(product.ingredientsAr) : [],
        allergens: product.allergens ? JSON.parse(product.allergens) : [],
        nutritionInfo: product.nutritionInfo ? JSON.parse(product.nutritionInfo) : null,
      }));

      res.json({
        success: true,
        data: productsWithParsedData
      });
    } catch (error) {
      console.error('Get featured products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};