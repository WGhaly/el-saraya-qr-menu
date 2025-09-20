import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 5: Adding Tea varieties...');

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

  // Tea varieties
  const teaVarieties = [
    {
      nameEn: 'Tea with Milk',
      nameAr: 'شاى بالحليب',
      descriptionEn: 'Traditional tea with creamy milk',
      descriptionAr: 'الشاي التراثي مع الحليب الكريمي',
      basePrice: 8.00,
    },
    {
      nameEn: 'Hibiscus Tea',
      nameAr: 'كركدية',
      descriptionEn: 'Refreshing hibiscus herbal tea',
      descriptionAr: 'شاي الكركدية العشبي المنعش',
      basePrice: 10.00,
    },
    {
      nameEn: 'Hot Lemon',
      nameAr: 'ليمون سخن',
      descriptionEn: 'Hot water with fresh lemon',
      descriptionAr: 'الماء الساخن مع الليمون الطازج',
      basePrice: 6.00,
    },
    {
      nameEn: 'Green Tea',
      nameAr: 'شاى اخضر',
      descriptionEn: 'Premium green tea leaves',
      descriptionAr: 'أوراق الشاي الأخضر المميزة',
      basePrice: 12.00,
    },
    {
      nameEn: 'Boiled Mint',
      nameAr: 'نعناع مغلى',
      descriptionEn: 'Fresh mint leaves in hot water',
      descriptionAr: 'أوراق النعناع الطازج في الماء الساخن',
      basePrice: 8.00,
    },
    {
      nameEn: 'Fenugreek Tea',
      nameAr: 'حلبة',
      descriptionEn: 'Traditional fenugreek herbal tea',
      descriptionAr: 'شاي الحلبة العشبي التراثي',
      basePrice: 10.00,
    },
    {
      nameEn: 'Regular Tea',
      nameAr: 'شاى',
      descriptionEn: 'Classic black tea',
      descriptionAr: 'الشاي الأسود الكلاسيكي',
      basePrice: 5.00,
    },
    {
      nameEn: 'Iced Tea',
      nameAr: 'شاى براد',
      descriptionEn: 'Cold brewed tea served chilled',
      descriptionAr: 'الشاي البارد المقدم مثلجاً',
      basePrice: 8.00,
    },
    {
      nameEn: 'Double Iced Tea',
      nameAr: 'شاى براد دوبل',
      descriptionEn: 'Extra strong cold brewed tea',
      descriptionAr: 'الشاي البارد القوي المضاعف',
      basePrice: 12.00,
    }
  ];

  for (const product of teaVarieties) {
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

    console.log(`☕ Tea created: ${createdProduct.nameEn} / ${createdProduct.nameAr}`);

    // Add size variations
    const sizeVariations = [
      { nameEn: 'Small', nameAr: 'صغير', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
      { nameEn: 'Large', nameAr: 'كبير', type: VariationType.SIZE, priceModifier: 3.0, isDefault: false, sortOrder: 2 },
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

  console.log('✅ Step 5 completed: Tea varieties added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 5 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });