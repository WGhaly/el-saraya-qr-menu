import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 6: Adding Coffee Specialties...');

  // Get admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@saraya.com' }
  });

  if (!admin) {
    throw new Error('Admin user not found');
  }

  // Get Coffee Specialties category
  const coffeeCategory = await prisma.category.findFirst({
    where: { nameEn: 'Coffee Specialties' }
  });

  if (!coffeeCategory) {
    throw new Error('Coffee Specialties category not found');
  }

  // Coffee products
  const coffeeProducts = [
    {
      nameEn: 'Single Espresso',
      nameAr: 'إسبرسو سنجل',
      descriptionEn: 'Single shot of premium espresso',
      descriptionAr: 'جرعة واحدة من الإسبرسو المميز',
      basePrice: 12.00,
    },
    {
      nameEn: 'Double Espresso',
      nameAr: 'إسبرسو دوبل',
      descriptionEn: 'Double shot of rich espresso',
      descriptionAr: 'جرعة مضاعفة من الإسبرسو الغني',
      basePrice: 18.00,
    },
    {
      nameEn: 'Cappuccino',
      nameAr: 'كابيتشينو',
      descriptionEn: 'Classic cappuccino with steamed milk',
      descriptionAr: 'الكابيتشينو الكلاسيكي مع الحليب المبخر',
      basePrice: 16.00,
    },
    {
      nameEn: 'Mocha',
      nameAr: 'موى',
      descriptionEn: 'Coffee with chocolate and steamed milk',
      descriptionAr: 'القهوة مع الشوكولاتة والحليب المبخر',
      basePrice: 20.00,
    },
    {
      nameEn: 'Coffee Latte',
      nameAr: 'كافية لاتية',
      descriptionEn: 'Smooth latte with steamed milk',
      descriptionAr: 'اللاتيه الناعم مع الحليب المبخر',
      basePrice: 18.00,
    },
    {
      nameEn: 'Caramel Macchiato',
      nameAr: 'ميكاتو كراميل',
      descriptionEn: 'Espresso with caramel and steamed milk',
      descriptionAr: 'الإسبرسو مع الكراميل والحليب المبخر',
      basePrice: 22.00,
    }
  ];

  for (const product of coffeeProducts) {
    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { 
        nameEn: product.nameEn,
        categoryId: coffeeCategory.id
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
        categoryId: coffeeCategory.id,
        createdById: admin.id,
        sortOrder: 1,
        isFeatured: true, // Coffee is featured
        isActive: true,
      },
    });

    console.log(`☕ Coffee created: ${createdProduct.nameEn} / ${createdProduct.nameAr}`);

    // Add size variations
    const sizeVariations = [
      { nameEn: 'Small', nameAr: 'صغير', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
      { nameEn: 'Large', nameAr: 'كبير', type: VariationType.SIZE, priceModifier: 6.0, isDefault: false, sortOrder: 2 },
    ];

    for (const variation of sizeVariations) {
      await prisma.productVariation.create({
        data: {
          ...variation,
          productId: createdProduct.id,
        },
      });
    }

    // Add flavor variations for some coffee types
    if (['Cappuccino', 'Coffee Latte'].includes(product.nameEn)) {
      const flavorVariations = [
        { nameEn: 'Caramel', nameAr: 'كراميل', type: VariationType.EXTRAS, priceModifier: 3.0, isDefault: false, sortOrder: 1 },
        { nameEn: 'Hazelnut', nameAr: 'بندق', type: VariationType.EXTRAS, priceModifier: 3.0, isDefault: false, sortOrder: 2 },
        { nameEn: 'Vanilla', nameAr: 'فانليا', type: VariationType.EXTRAS, priceModifier: 3.0, isDefault: false, sortOrder: 3 },
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
  }

  console.log('✅ Step 6 completed: Coffee specialties added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 6 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });