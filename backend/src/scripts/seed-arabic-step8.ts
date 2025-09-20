import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 8: Adding Shisha varieties...');

  // Get admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@saraya.com' }
  });

  if (!admin) {
    throw new Error('Admin user not found');
  }

  // Get Shisha category
  const shishaCategory = await prisma.category.findFirst({
    where: { nameEn: 'Shisha' }
  });

  if (!shishaCategory) {
    throw new Error('Shisha category not found');
  }

  // Shisha products
  const shishaProducts = [
    {
      nameEn: 'Premium Shisha',
      nameAr: 'شيشة فاخر',
      descriptionEn: 'Premium quality shisha with fine tobacco',
      descriptionAr: 'شيشة فاخرة بتبغ عالي الجودة',
      basePrice: 45.00,
    },
    {
      nameEn: 'Fruit Shisha',
      nameAr: 'شيشة فواكة',
      descriptionEn: 'Fresh fruit flavored shisha',
      descriptionAr: 'شيشة بنكهات الفواكه الطازجة',
      basePrice: 40.00,
    },
    {
      nameEn: 'Molasses Shisha',
      nameAr: 'شيشة معسل',
      descriptionEn: 'Traditional molasses flavored shisha',
      descriptionAr: 'الشيشة التراثية بطعم المعسل',
      basePrice: 38.00,
    },
    {
      nameEn: 'Kas Shisha',
      nameAr: 'شيشة قص',
      descriptionEn: 'Special kas blend shisha',
      descriptionAr: 'شيشة خليط القص المميز',
      basePrice: 42.00,
    },
    {
      nameEn: 'Salloum Shisha',
      nameAr: 'شيشة سلوم',
      descriptionEn: 'Traditional Salloum style shisha',
      descriptionAr: 'شيشة سلوم التراثية',
      basePrice: 40.00,
    },
    {
      nameEn: 'Zaghloul Shisha',
      nameAr: 'شيشة زغلول',
      descriptionEn: 'Classic Zaghloul tobacco shisha',
      descriptionAr: 'شيشة تبغ زغلول الكلاسيكية',
      basePrice: 44.00,
    },
    {
      nameEn: 'Herbal Shisha',
      nameAr: 'شيشة لاى طبى',
      descriptionEn: 'Herbal tobacco-free shisha',
      descriptionAr: 'الشيشة العشبية الخالية من التبغ',
      basePrice: 35.00,
    }
  ];

  for (const product of shishaProducts) {
    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { 
        nameEn: product.nameEn,
        categoryId: shishaCategory.id
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
        categoryId: shishaCategory.id,
        createdById: admin.id,
        sortOrder: 1,
        isFeatured: true, // Shisha is featured
        isActive: true,
      },
    });

    console.log(`💨 Shisha created: ${createdProduct.nameEn} / ${createdProduct.nameAr}`);

    // Add flavor variations for fruit and molasses shisha
    if (['Fruit Shisha', 'Molasses Shisha'].includes(product.nameEn)) {
      const flavorVariations = [
        { nameEn: 'Apple', nameAr: 'تفاح', type: VariationType.EXTRAS, priceModifier: 0, isDefault: true, sortOrder: 1 },
        { nameEn: 'Grape', nameAr: 'عنب', type: VariationType.EXTRAS, priceModifier: 0, isDefault: false, sortOrder: 2 },
        { nameEn: 'Mint', nameAr: 'نعناع', type: VariationType.EXTRAS, priceModifier: 0, isDefault: false, sortOrder: 3 },
        { nameEn: 'Double Apple', nameAr: 'تفاحتين', type: VariationType.EXTRAS, priceModifier: 2.0, isDefault: false, sortOrder: 4 },
        { nameEn: 'Mixed Fruits', nameAr: 'فواكه مشكلة', type: VariationType.EXTRAS, priceModifier: 3.0, isDefault: false, sortOrder: 5 },
      ];

      for (const variation of flavorVariations) {
        await prisma.productVariation.create({
          data: {
            ...variation,
            productId: createdProduct.id,
          },
        });
      }
    }

    // Add coal type variations
    const coalVariations = [
      { nameEn: 'Natural Coal', nameAr: 'فحم طبيعي', type: VariationType.EXTRAS, priceModifier: 0, isDefault: true, sortOrder: 1 },
      { nameEn: 'Quick Light', nameAr: 'فحم سريع الاشتعال', type: VariationType.EXTRAS, priceModifier: -2.0, isDefault: false, sortOrder: 2 },
    ];

    for (const variation of coalVariations) {
      await prisma.productVariation.create({
        data: {
          ...variation,
          productId: createdProduct.id,
        },
      });
    }
  }

  console.log('✅ Step 8 completed: Shisha varieties added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 8 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });