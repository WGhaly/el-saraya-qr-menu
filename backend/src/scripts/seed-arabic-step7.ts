import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 7: Adding Cold Beverages...');

  // Get admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@saraya.com' }
  });

  if (!admin) {
    throw new Error('Admin user not found');
  }

  // Get Cold Beverages category
  const coldCategory = await prisma.category.findFirst({
    where: { nameEn: 'Cold Beverages' }
  });

  if (!coldCategory) {
    throw new Error('Cold Beverages category not found');
  }

  // Cold beverages products
  const coldBeverages = [
    {
      nameEn: 'Pepsi',
      nameAr: 'بيبسى',
      descriptionEn: 'Classic Pepsi cola',
      descriptionAr: 'كولا بيبسي الكلاسيكية',
      basePrice: 8.00,
    },
    {
      nameEn: '7UP',
      nameAr: 'سفن اب',
      descriptionEn: 'Refreshing lemon-lime soda',
      descriptionAr: 'الصودا المنعشة بطعم الليمون',
      basePrice: 8.00,
    },
    {
      nameEn: 'Mirinda',
      nameAr: 'ميرندا',
      descriptionEn: 'Orange flavored soda',
      descriptionAr: 'الصودا بنكهة البرتقال',
      basePrice: 8.00,
    },
    {
      nameEn: 'Birell',
      nameAr: 'بريل',
      descriptionEn: 'Non-alcoholic malt beverage',
      descriptionAr: 'مشروب الشعير الخالي من الكحول',
      basePrice: 12.00,
    },
    {
      nameEn: 'Fayrouz',
      nameAr: 'فيروز',
      descriptionEn: 'Apple flavored non-alcoholic drink',
      descriptionAr: 'مشروب بطعم التفاح خالي من الكحول',
      basePrice: 12.00,
    },
    {
      nameEn: 'Gold',
      nameAr: 'جولد',
      descriptionEn: 'Premium malt beverage',
      descriptionAr: 'مشروب الشعير المميز',
      basePrice: 14.00,
    },
    {
      nameEn: 'Mineral Water',
      nameAr: 'مياة معدنية',
      descriptionEn: 'Pure mineral water',
      descriptionAr: 'المياه المعدنية النقية',
      basePrice: 5.00,
    }
  ];

  for (const product of coldBeverages) {
    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { 
        nameEn: product.nameEn,
        categoryId: coldCategory.id
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
        categoryId: coldCategory.id,
        createdById: admin.id,
        sortOrder: 1,
        isFeatured: false,
        isActive: true,
      },
    });

    console.log(`🥤 Cold beverage created: ${createdProduct.nameEn} / ${createdProduct.nameAr}`);

    // Add size variations for beverages
    if (!['Mineral Water'].includes(product.nameEn)) {
      const sizeVariations = [
        { nameEn: 'Small Can', nameAr: 'علبة صغيرة', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
        { nameEn: 'Large Bottle', nameAr: 'زجاجة كبيرة', type: VariationType.SIZE, priceModifier: 4.0, isDefault: false, sortOrder: 2 },
      ];

      for (const variation of sizeVariations) {
        await prisma.productVariation.create({
          data: {
            ...variation,
            productId: createdProduct.id,
          },
        });
      }
    } else {
      // Water has different sizes
      const waterSizes = [
        { nameEn: 'Small Bottle', nameAr: 'زجاجة صغيرة', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
        { nameEn: 'Large Bottle', nameAr: 'زجاجة كبيرة', type: VariationType.SIZE, priceModifier: 3.0, isDefault: false, sortOrder: 2 },
      ];

      for (const variation of waterSizes) {
        await prisma.productVariation.create({
          data: {
            ...variation,
            productId: createdProduct.id,
          },
        });
      }
    }
  }

  console.log('✅ Step 7 completed: Cold beverages added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 7 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });