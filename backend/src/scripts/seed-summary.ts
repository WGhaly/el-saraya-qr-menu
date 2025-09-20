import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Arabic Product Seeding Summary Report\n');

  // Get all categories
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  console.log('📂 Categories Created:');
  categories.forEach(category => {
    console.log(`   • ${category.nameEn} / ${category.nameAr} (${category._count.products} products)`);
  });

  // Get total counts
  const totalProducts = await prisma.product.count();
  const totalVariations = await prisma.productVariation.count();
  const totalUsers = await prisma.user.count();

  console.log('\n📈 Database Statistics:');
  console.log(`   • Total Categories: ${categories.length}`);
  console.log(`   • Total Products: ${totalProducts}`);
  console.log(`   • Total Variations: ${totalVariations}`);
  console.log(`   • Total Users: ${totalUsers}`);

  // Get some sample products from each category
  console.log('\n🍽️ Sample Products by Category:');
  
  for (const category of categories) {
    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      select: { nameEn: true, nameAr: true, basePrice: true },
      take: 3
    });
    
    console.log(`\n   ${category.nameEn} / ${category.nameAr}:`);
    products.forEach(product => {
      console.log(`     - ${product.nameEn} / ${product.nameAr} (${product.basePrice} EGP)`);
    });
  }

  // Check users
  const users = await prisma.user.findMany({
    select: { email: true, firstName: true, lastName: true }
  });

  console.log('\n👤 System Users:');
  users.forEach(user => {
    console.log(`   • ${user.email} (${user.firstName} ${user.lastName})`);
  });

  console.log('\n✅ Arabic product seeding completed successfully!');
  console.log('🎉 The admin panel should now show all categories and products with Arabic names.');
  console.log('🌐 Access the admin panel at: http://localhost:3000/admin');
  console.log('📱 Access the public menu at: http://localhost:3000');
}

main()
  .catch((e) => {
    console.error('❌ Summary failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });