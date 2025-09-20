import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 3: Adding more Hot Drinks products...');

  // Get admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@saraya.com' }
  });

  if (!admin) {
    throw new Error('Admin user not found');
  }

  // Get Hot Drinks category
  const hotDrinksCategory = await prisma.category.findFirst({
    where: { nameEn: 'Hot Drinks' }
  });

  if (!hotDrinksCategory) {
    throw new Error('Hot Drinks category not found');
  }

  // More hot drinks products
  const moreHotDrinks = [
    {
      nameEn: 'Plain Ginger',
      nameAr: 'جنزبيل سادة',
      descriptionEn: 'Pure ginger tea for warmth and wellness',
      descriptionAr: 'شاي الجنزبيل النقي للدفء والصحة',
      basePrice: 12.00,
    },
    {
      nameEn: 'Hot Chocolate',
      nameAr: 'هوت شوكلت',
      descriptionEn: 'Rich and creamy hot chocolate',
      descriptionAr: 'الشوكولاتة الساخنة الغنية والكريمية',
      basePrice: 16.00,
    },
    {
      nameEn: 'Sahlab with Nuts',
      nameAr: 'سحلب بالمكسرات',
      descriptionEn: 'Traditional sahlab with mixed nuts',
      descriptionAr: 'السحلب التراثي مع المكسرات المتنوعة',
      basePrice: 20.00,
    },
    {
      nameEn: 'Sahlab with Chocolate',
      nameAr: 'سحلب بالشكولاتة',
      descriptionEn: 'Creamy sahlab with chocolate flavor',
      descriptionAr: 'السحلب الكريمي بنكهة الشوكولاتة',
      basePrice: 22.00,
    },
    {
      nameEn: 'Sahlab with Oreo',
      nameAr: 'سحلب بالبوريو',
      descriptionEn: 'Sahlab topped with crushed Oreo cookies',
      descriptionAr: 'السحلب مع قطع الأوريو المهروسة',
      basePrice: 24.00,
    }
  ];

  for (const product of moreHotDrinks) {
    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { 
        nameEn: product.nameEn,
        categoryId: hotDrinksCategory.id
      }
    });
    
    if (existingProduct) {
      console.log(`Product ${product.nameEn} already exists, skipping...`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        descriptionEn: product.descriptionEn,
        descriptionAr: product.descriptionAr,
        basePrice: product.basePrice,
        categoryId: hotDrinksCategory.id,
        createdById: admin.id,
        sortOrder: 1,
        isFeatured: false,
        isActive: true,
      },
    });

    console.log(`🔥 Hot drink created: ${createdProduct.nameEn} / ${createdProduct.nameAr}`);

    // Add size variations
    const sizeVariations = [
      { nameEn: 'Small', nameAr: 'صغير', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
      { nameEn: 'Large', nameAr: 'كبير', type: VariationType.SIZE, priceModifier: 5.0, isDefault: false, sortOrder: 2 },
    ];

    for (const variation of sizeVariations) {
      await prisma.productVariation.create({
        data: {
          ...variation,
          productId: createdProduct.id,
        },
      });
    }
  }

  console.log('✅ Step 3 completed: More hot drinks added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 3 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });