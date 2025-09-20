import { PrismaClient, UserRole, VariationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Step 1: Creating Arabic categories and users...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@saraya.com' },
    update: {},
    create: {
      email: 'admin@saraya.com',
      password: hashedPassword,
      firstName: 'Saraya',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('👤 Admin user created:', admin.email);

  // Create additional user
  const tahaPassword = await bcrypt.hash('01093463235', 12);
  
  const tahaUser = await prisma.user.upsert({
    where: { email: 'tahasinger@saraya.com' },
    update: {},
    create: {
      email: 'tahasinger@saraya.com',
      password: tahaPassword,
      firstName: 'Taha',
      lastName: 'Singer',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('👤 Taha user created:', tahaUser.email);

  // Create Arabic categories
  const categories = [
    {
      nameEn: 'Hot Drinks',
      nameAr: 'مشروبات ساخنة',
      descriptionEn: 'Traditional hot beverages to warm your soul',
      descriptionAr: 'مشروبات ساخنة تراثية لتدفئة الروح',
      sortOrder: 1,
      isActive: true,
    },
    {
      nameEn: 'Coffee Specialties',
      nameAr: 'أنواع القهوة',
      descriptionEn: 'Premium coffee varieties and blends',
      descriptionAr: 'أصناف وخلطات القهوة المميزة',
      sortOrder: 2,
      isActive: true,
    },
    {
      nameEn: 'Cold Beverages',
      nameAr: 'المشروبات الباردة',
      descriptionEn: 'Refreshing cold drinks and sodas',
      descriptionAr: 'مشروبات باردة ومنعشة',
      sortOrder: 3,
      isActive: true,
    },
    {
      nameEn: 'Shisha',
      nameAr: 'الشيشة',
      descriptionEn: 'Premium shisha flavors and varieties',
      descriptionAr: 'نكهات وأصناف الشيشة المميزة',
      sortOrder: 4,
      isActive: true,
    },
    {
      nameEn: 'Extras',
      nameAr: 'الإضافات',
      descriptionEn: 'Nuts, honey, and special sauces',
      descriptionAr: 'المكسرات والعسل والصوصات المميزة',
      sortOrder: 5,
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
      console.log(`📂 Category exists: ${createdCategory.nameEn}`);
    } else {
      createdCategory = await prisma.category.create({
        data: {
          ...category,
          createdById: admin.id,
        },
      });
      console.log(`📂 Category created: ${createdCategory.nameEn} / ${createdCategory.nameAr}`);
    }
    createdCategories.push(createdCategory);
  }

  console.log('✅ Step 1 completed: Categories and users created!');
}

main()
  .catch((e) => {
    console.error('❌ Step 1 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });