import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 10: Adding Extras category and products...');

  // Get admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@saraya.com' }
  });

  if (!admin) {
    throw new Error('Admin user not found');
  }

  // Check if category exists
  let extrasCategory = await prisma.category.findFirst({
    where: { nameEn: 'Extras' }
  });

  // Create Extras category if it doesn't exist
  if (!extrasCategory) {
    extrasCategory = await prisma.category.create({
      data: {
        nameEn: 'Extras',
        nameAr: 'إضافات',
        descriptionEn: 'Additional items and enhancements',
        descriptionAr: 'عناصر وإضافات إضافية',
        sortOrder: 6,
        isActive: true,
        createdById: admin.id,
      },
    });
    console.log(`📂 Category created: ${extrasCategory.nameEn} / ${extrasCategory.nameAr}`);
  }

  // Extras products
  const extrasProducts = [
    {
      nameEn: 'Nuts Mix',
      nameAr: 'مكسرات مشكلة',
      descriptionEn: 'Assorted mixed nuts',
      descriptionAr: 'مجموعة متنوعة من المكسرات',
      basePrice: 15.00,
    },
    {
      nameEn: 'Almonds',
      nameAr: 'لوز',
      descriptionEn: 'Premium roasted almonds',
      descriptionAr: 'لوز محمص فاخر',
      basePrice: 18.00,
    },
    {
      nameEn: 'Pistachios',
      nameAr: 'فستق',
      descriptionEn: 'Roasted pistachios',
      descriptionAr: 'فستق محمص',
      basePrice: 25.00,
    },
    {
      nameEn: 'Cashews',
      nameAr: 'كاجو',
      descriptionEn: 'Roasted cashew nuts',
      descriptionAr: 'كاجو محمص',
      basePrice: 22.00,
    },
    {
      nameEn: 'Honey',
      nameAr: 'عسل',
      descriptionEn: 'Natural pure honey',
      descriptionAr: 'عسل طبيعي خالص',
      basePrice: 20.00,
    },
    {
      nameEn: 'White Honey',
      nameAr: 'عسل أبيض',
      descriptionEn: 'Premium white honey',
      descriptionAr: 'عسل أبيض فاخر',
      basePrice: 25.00,
    },
    {
      nameEn: 'Caramel Sauce',
      nameAr: 'صوص كراميل',
      descriptionEn: 'Rich caramel sauce',
      descriptionAr: 'صوص الكراميل الغني',
      basePrice: 8.00,
    },
    {
      nameEn: 'Strawberry Sauce',
      nameAr: 'صوص فراولة',
      descriptionEn: 'Fresh strawberry sauce',
      descriptionAr: 'صوص الفراولة الطازج',
      basePrice: 8.00,
    },
    {
      nameEn: 'Chocolate Sauce',
      nameAr: 'صوص شيكولاتة',
      descriptionEn: 'Rich chocolate sauce',
      descriptionAr: 'صوص الشوكولاتة الغني',
      basePrice: 8.00,
    },
    {
      nameEn: 'Nutella',
      nameAr: 'نوتيلا',
      descriptionEn: 'Hazelnut chocolate spread',
      descriptionAr: 'كريمة الشوكولاتة بالبندق',
      basePrice: 12.00,
    },
    {
      nameEn: 'Extra Shot',
      nameAr: 'جرعة إضافية',
      descriptionEn: 'Additional espresso shot',
      descriptionAr: 'جرعة إسبرسو إضافية',
      basePrice: 6.00,
    },
    {
      nameEn: 'Whipped Cream',
      nameAr: 'كريمة مخفوقة',
      descriptionEn: 'Fresh whipped cream',
      descriptionAr: 'كريمة مخفوقة طازجة',
      basePrice: 5.00,
    },
    {
      nameEn: 'Ice Cream Scoop',
      nameAr: 'كرة آيس كريم',
      descriptionEn: 'Vanilla ice cream scoop',
      descriptionAr: 'كرة آيس كريم فانيليا',
      basePrice: 10.00,
    }
  ];

  for (const product of extrasProducts) {
    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { 
        nameEn: product.nameEn,
        categoryId: extrasCategory.id
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
        categoryId: extrasCategory.id,
        createdById: admin.id,
        sortOrder: 1,
        isFeatured: false,
        isActive: true,
      },
    });

    console.log(`🥜 Extra created: ${createdProduct.nameEn} / ${createdProduct.nameAr}`);

    // Add size variations for nuts and honey
    if (['Nuts Mix', 'Almonds', 'Pistachios', 'Cashews', 'Honey', 'White Honey'].includes(product.nameEn)) {
      const sizeVariations = [
        { nameEn: 'Small', nameAr: 'صغير', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
        { nameEn: 'Large', nameAr: 'كبير', type: VariationType.SIZE, priceModifier: 10.0, isDefault: false, sortOrder: 2 },
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

    // Add flavor variations for ice cream
    if (product.nameEn === 'Ice Cream Scoop') {
      const flavorVariations = [
        { nameEn: 'Vanilla', nameAr: 'فانيليا', type: VariationType.EXTRAS, priceModifier: 0, isDefault: true, sortOrder: 1 },
        { nameEn: 'Chocolate', nameAr: 'شوكولاتة', type: VariationType.EXTRAS, priceModifier: 0, isDefault: false, sortOrder: 2 },
        { nameEn: 'Strawberry', nameAr: 'فراولة', type: VariationType.EXTRAS, priceModifier: 0, isDefault: false, sortOrder: 3 },
        { nameEn: 'Mango', nameAr: 'مانجو', type: VariationType.EXTRAS, priceModifier: 0, isDefault: false, sortOrder: 4 },
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

  console.log('✅ Step 10 completed: Extras category and products added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 10 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });