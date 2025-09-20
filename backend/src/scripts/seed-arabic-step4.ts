import { PrismaClient, VariationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 4: Adding final Hot Drinks and Tea products...');

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

  // Final hot drinks and teas
  const finalHotDrinks = [
    {
      nameEn: 'Sahlab with Fruits',
      nameAr: 'سحلب بالفواكة',
      descriptionEn: 'Sahlab with fresh seasonal fruits',
      descriptionAr: 'السحلب مع الفواكه الموسمية الطازجة',
      basePrice: 25.00,
    },
    {
      nameEn: 'Chickpeas (Halabsa)',
      nameAr: 'حمص (حلبسة)',
      descriptionEn: 'Traditional warm chickpeas drink',
      descriptionAr: 'مشروب الحمص الساخن التراثي',
      basePrice: 15.00,
    },
    {
      nameEn: 'Belila',
      nameAr: 'بليلة',
      descriptionEn: 'Sweet wheat pudding drink',
      descriptionAr: 'مشروب البليلة الحلو',
      basePrice: 18.00,
    },
    {
      nameEn: 'Om Ali',
      nameAr: 'ام على',
      descriptionEn: 'Traditional Egyptian bread pudding drink',
      descriptionAr: 'مشروب أم علي المصري التراثي',
      basePrice: 22.00,
    },
    {
      nameEn: 'Om Ali with Fruits',
      nameAr: 'ام على بالفواكة',
      descriptionEn: 'Om Ali topped with fresh fruits',
      descriptionAr: 'أم علي مع الفواكه الطازجة',
      basePrice: 26.00,
    },
    {
      nameEn: 'Fenugreek with Milk',
      nameAr: 'حلبة بالحليب',
      descriptionEn: 'Fenugreek drink with creamy milk',
      descriptionAr: 'مشروب الحلبة مع الحليب الكريمي',
      basePrice: 14.00,
    }
  ];

  for (const product of finalHotDrinks) {
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

  console.log('✅ Step 4 completed: Final hot drinks and tea products added!');
}

main()
  .catch((e) => {
    console.error('❌ Step 4 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });