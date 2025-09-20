import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 9: Adding more Coffee varieties...');

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

  // More coffee products
  const moreCoffeeProducts = [
    {
      nameEn: 'Flat White',
      nameAr: 'فلات وايت',
      descriptionEn: 'Strong espresso with steamed milk',
      descriptionAr: 'إسبرسو قوي مع الحليب المبخر',
      basePrice: 19.00,
    },
    {
      nameEn: 'Nescafe',
      nameAr: 'نسكافية',
      descriptionEn: 'Classic instant coffee',
      descriptionAr: 'القهوة الفورية الكلاسيكية',
      basePrice: 10.00,
    },
    {
      nameEn: 'Frappe',
      nameAr: 'فرابية',
      descriptionEn: 'Iced coffee drink with foam',
      descriptionAr: 'مشروب القهوة المثلج مع الرغوة',
      basePrice: 18.00,
    },
    {
      nameEn: 'Latte Espresso Caramel Crunch',
      nameAr: 'لاتية إسبرسو كراميل كرانشى',
      descriptionEn: 'Latte with espresso and caramel crunch',
      descriptionAr: 'لاتيه مع الإسبرسو وقطع الكراميل المقرمشة',
      basePrice: 24.00,
    },
    {
      nameEn: 'Nutella Coffee',
      nameAr: 'نوتيلا كوفى',
      descriptionEn: 'Coffee with Nutella chocolate spread',
      descriptionAr: 'القهوة مع كريمة الشوكولاتة نوتيلا',
      basePrice: 22.00,
    },
    {
      nameEn: 'Turkish Coffee',
      nameAr: 'قهوة تركى',
      descriptionEn: 'Traditional Turkish coffee',
      descriptionAr: 'القهوة التركية التراثية',
      basePrice: 16.00,
    },
    {
      nameEn: 'Hazelnut Coffee',
      nameAr: 'قهوة بندق',
      descriptionEn: 'Coffee with hazelnut flavor',
      descriptionAr: 'القهوة بنكهة البندق',
      basePrice: 18.00,
    },
    {
      nameEn: 'French Coffee',
      nameAr: 'قهوة فرنساوى',
      descriptionEn: 'French style coffee blend',
      descriptionAr: 'خليط القهوة الفرنسية',
      basePrice: 20.00,
    },
    {
      nameEn: 'Chocolate Net',
      nameAr: 'شيكولاتة نت',
      descriptionEn: 'Iced chocolate drink with whipped cream',
      descriptionAr: 'مشروب الشوكولاتة المثلج مع الكريمة المخفوقة',
      basePrice: 20.00,
    },
    {
      nameEn: 'Caramel Net',
      nameAr: 'كاراميل نت',
      descriptionEn: 'Iced caramel drink with whipped cream',
      descriptionAr: 'مشروب الكراميل المثلج مع الكريمة المخفوقة',
      basePrice: 20.00,
    }
  ];

  for (const product of moreCoffeeProducts) {
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
        isFeatured: true,
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

    // Add temperature variations for cold drinks
    if (['Frappe', 'Chocolate Net', 'Caramel Net'].includes(product.nameEn)) {
      const tempVariations = [
        { nameEn: 'Iced', nameAr: 'مثلج', type: VariationType.TEMPERATURE, priceModifier: 0, isDefault: true, sortOrder: 1 },
        { nameEn: 'Hot', nameAr: 'ساخن', type: VariationType.TEMPERATURE, priceModifier: 0, isDefault: false, sortOrder: 2 },
      ];

      for (const variation of tempVariations) {
        await prisma.productVariation.create({
          data: {
            ...variation,
            productId: createdProduct.id,
          },
        });
      }
    }
  }

  console.log('✅ Step 9 completed: More coffee varieties added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 9 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });