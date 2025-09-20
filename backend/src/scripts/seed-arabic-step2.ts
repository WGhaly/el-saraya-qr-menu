import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 2: Adding Hot Drinks products...');

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

  // Hot drinks products - First batch
  const hotDrinks = [
    {
      nameEn: 'Hot Cider',
      nameAr: 'هوت سيدر',
      descriptionEn: 'Warm spiced apple cider',
      descriptionAr: 'عصير التفاح المتبل الساخن',
      basePrice: 15.00,
    },
    {
      nameEn: 'Herbal Cocktail with Honey',
      nameAr: 'كوكتيل أعشاب بالعسل',
      descriptionEn: 'Mixed herbs blend with natural honey',
      descriptionAr: 'خليط الأعشاب المتنوعة مع العسل الطبيعي',
      basePrice: 18.00,
    },
    {
      nameEn: 'Cinnamon with Milk',
      nameAr: 'قرفة بالحليب',
      descriptionEn: 'Warm cinnamon drink with creamy milk',
      descriptionAr: 'مشروب القرفة الدافئ مع الحليب الكريمي',
      basePrice: 12.00,
    },
    {
      nameEn: 'Cinnamon with Ginger',
      nameAr: 'قرفة بالجنزبيل',
      descriptionEn: 'Warming cinnamon and ginger blend',
      descriptionAr: 'خليط القرفة والجنزبيل المدفئ',
      basePrice: 14.00,
    },
    {
      nameEn: 'Plain Cinnamon',
      nameAr: 'قرفة سادة',
      descriptionEn: 'Simple traditional cinnamon drink',
      descriptionAr: 'مشروب القرفة التراثي البسيط',
      basePrice: 10.00,
    }
  ];

  for (const product of hotDrinks) {
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

  console.log('✅ Step 2 completed: Hot drinks added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 2 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });