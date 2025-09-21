import { PrismaClient, UserRole, VariationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting الســـرايــا QR Menu database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@saraya.com' },
    update: {},
    create: {
      email: 'admin@saraya.com',
      password: hashedPassword,
      firstName: 'الســـرايــا',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('👤 Admin user created:', admin.email);

  // Create menu configuration
  const menuConfig = await prisma.menuConfig.upsert({
    where: { id: 'main-config' },
    update: {},
    create: {
      id: 'main-config',
      restaurantNameEn: 'Al-Saraya Drinks',
      restaurantNameAr: 'مشروبات سرايا',
      restaurantDescriptionEn: 'Premium drinks and beverages with authentic flavors that transport you to a world of taste and tradition.',
      restaurantDescriptionAr: 'مشروبات فاخرة ومميزة بنكهات أصيلة تنقلك إلى عالم من الطعم والتراث.',
      primaryColor: '#723713',
      secondaryColor: '#b58350',
      isActive: true,
      openingHours: JSON.stringify({
        monday: { open: '08:00', close: '22:00', isClosed: false },
        tuesday: { open: '08:00', close: '22:00', isClosed: false },
        wednesday: { open: '08:00', close: '22:00', isClosed: false },
        thursday: { open: '08:00', close: '22:00', isClosed: false },
        friday: { open: '08:00', close: '23:00', isClosed: false },
        saturday: { open: '09:00', close: '23:00', isClosed: false },
        sunday: { open: '09:00', close: '22:00', isClosed: false },
      }),
      contactInfo: JSON.stringify({
        phone: '+1 (555) 123-4567',
        email: 'info@saraya-drinks.com',
        address: '123 Heritage Street, Downtown District',
        website: 'www.saraya-drinks.com'
      }),
      socialLinks: JSON.stringify({
        instagram: '@saraya_drinks',
        facebook: 'SarayaDrinks',
        whatsapp: '+15551234567'
      })
    },
  });

  console.log('⚙️ Menu configuration created');

  // Create categories
  const categories = [
    {
      nameEn: 'Traditional Coffee',
      nameAr: 'القهوة التراثية',
      descriptionEn: 'Authentic Arabic coffee blends with rich heritage flavors',
      descriptionAr: 'خلطات قهوة عربية أصيلة بنكهات تراثية غنية',
      sortOrder: 1,
      isActive: true,
    },
    {
      nameEn: 'Premium Tea Collection',
      nameAr: 'مجموعة الشاي الممتاز',
      descriptionEn: 'Carefully selected tea varieties from around the world',
      descriptionAr: 'أنواع شاي منتقاة بعناية من حول العالم',
      sortOrder: 2,
      isActive: true,
    },
    {
      nameEn: 'Fresh Juices',
      nameAr: 'العصائر الطازجة',
      descriptionEn: 'Freshly squeezed natural juices bursting with vitamins',
      descriptionAr: 'عصائر طبيعية طازجة مليئة بالفيتامينات',
      sortOrder: 3,
      isActive: true,
    }
  ];

  const createdCategories = [];
  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { nameEn: category.nameEn }
    });

    let createdCategory;
    if (existingCategory) {
      createdCategory = existingCategory;
    } else {
      createdCategory = await prisma.category.create({
        data: {
          ...category,
          createdById: admin.id,
        },
      });
    }
    createdCategories.push(createdCategory);
    console.log(`📂 Category created: ${createdCategory.nameEn}`);
  }

  // Create sample products
  const products = [
    {
      nameEn: 'Qahwa Arabica',
      nameAr: 'قهوة عربيكا',
      descriptionEn: 'Traditional Arabic coffee with cardamom and saffron',
      descriptionAr: 'قهوة عربية تراثية مع الهيل والزعفران',
      basePrice: 12.50,
      categoryNameEn: 'Traditional Coffee',
      isFeatured: true,
    },
    {
      nameEn: 'Earl Grey Supreme',
      nameAr: 'إيرل جراي ممتاز',
      descriptionEn: 'Classic Earl Grey with bergamot oil and cornflower petals',
      descriptionAr: 'إيرل جراي كلاسيكي مع زيت البرغموت وبتلات الذرة',
      basePrice: 8.50,
      categoryNameEn: 'Premium Tea Collection',
      isFeatured: true,
    },
    {
      nameEn: 'Pomegranate Power',
      nameAr: 'عصير الرمان',
      descriptionEn: 'Pure pomegranate juice packed with antioxidants',
      descriptionAr: 'عصير رمان نقي مليء بمضادات الأكسدة',
      basePrice: 11.00,
      categoryNameEn: 'Fresh Juices',
      isFeatured: true,
    }
  ];

  for (const productInfo of products) {
    const category = createdCategories.find(c => c.nameEn === productInfo.categoryNameEn);
    if (!category) continue;

    const existingProduct = await prisma.product.findFirst({
      where: { 
        nameEn: productInfo.nameEn,
        categoryId: category.id
      }
    });
    
    if (existingProduct) {
      console.log(`Product ${productInfo.nameEn} already exists, skipping...`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        nameEn: productInfo.nameEn,
        nameAr: productInfo.nameAr,
        descriptionEn: productInfo.descriptionEn,
        descriptionAr: productInfo.descriptionAr,
        basePrice: productInfo.basePrice,
        isFeatured: productInfo.isFeatured,
        categoryId: category.id,
        createdById: admin.id,
        sortOrder: 1,
      },
    });

    console.log(`🍹 Product created: ${product.nameEn}`);

    // Create basic size variations
    const sizeVariations = [
      { nameEn: 'Small', nameAr: 'صغير', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
      { nameEn: 'Medium', nameAr: 'وسط', type: VariationType.SIZE, priceModifier: 2.5, isDefault: false, sortOrder: 2 },
      { nameEn: 'Large', nameAr: 'كبير', type: VariationType.SIZE, priceModifier: 4.5, isDefault: false, sortOrder: 3 },
    ];

    for (const variation of sizeVariations) {
      await prisma.productVariation.create({
        data: {
          ...variation,
          productId: product.id,
        },
      });
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('🎯 Login credentials: admin@saraya.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });