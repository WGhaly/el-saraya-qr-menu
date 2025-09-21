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
    },
    {
      nameEn: 'Specialty Smoothies',
      nameAr: 'عصائر السموذي المميزة',
      descriptionEn: 'Nutritious smoothie blends with fresh fruits and superfoods',
      descriptionAr: 'خلطات سموذي مغذية بالفواكه الطازجة والأطعمة الخارقة',
      sortOrder: 4,
      isActive: true,
    },
    {
      nameEn: 'Iced Beverages',
      nameAr: 'المشروبات المثلجة',
      descriptionEn: 'Refreshing cold drinks perfect for any season',
      descriptionAr: 'مشروبات باردة منعشة مثالية لأي موسم',
      sortOrder: 5,
      isActive: true,
    },
    {
      nameEn: 'Signature Mocktails',
      nameAr: 'الكوكتيلات المميزة',
      descriptionEn: 'Creative non-alcoholic cocktails with unique flavor combinations',
      descriptionAr: 'كوكتيلات إبداعية خالية من الكحول بتوليفات نكهات فريدة',
      sortOrder: 6,
      isActive: true,
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    // Check if category already exists by nameEn
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

  // Create products for each category
  const productData = [
    // Traditional Coffee
    {
      categoryName: 'Traditional Coffee',
      products: [
        {
          nameEn: 'Qahwa Arabica',
          nameAr: 'قهوة عربيكا',
          descriptionEn: 'Traditional Arabic coffee with cardamom and saffron, served in authentic style',
          descriptionAr: 'قهوة عربية تراثية مع الهيل والزعفران، تُقدم بالطريقة الأصيلة',
          basePrice: 12.50,
          isFeatured: true,
          preparationTime: '5-7 minutes',
          ingredients: ['Premium Arabica beans', 'Cardamom pods', 'Saffron threads', 'Rose water'],
          allergens: [],
          nutritionInfo: { calories: 5, caffeine: 95 },
        },
        {
          nameEn: 'Turkish Coffee Supreme',
          nameAr: 'قهوة تركية ممتازة',
          descriptionEn: 'Rich and intense Turkish coffee prepared in traditional copper cezve',
          descriptionAr: 'قهوة تركية غنية ومكثفة محضرة في الجزفة النحاسية التراثية',
          basePrice: 15.00,
          isFeatured: true,
          preparationTime: '8-10 minutes',
          ingredients: ['Fine Turkish coffee grounds', 'Sugar', 'Water'],
          allergens: [],
          nutritionInfo: { calories: 20, caffeine: 120 },
        },
        {
          nameEn: 'Cortado Blend',
          nameAr: 'خليط كورتادو',
          descriptionEn: 'Smooth espresso with steamed milk in perfect harmony',
          descriptionAr: 'إسبرسو ناعم مع الحليب المبخر في انسجام مثالي',
          basePrice: 9.75,
          preparationTime: '3-5 minutes',
          ingredients: ['Espresso', 'Steamed milk', 'Milk foam'],
          allergens: ['Dairy'],
          nutritionInfo: { calories: 90, caffeine: 85, fat: 4.5 },
        },
      ]
    },
    // Premium Tea Collection
    {
      categoryName: 'Premium Tea Collection',
      products: [
        {
          name: 'Earl Grey Supreme',
          description: 'Classic Earl Grey with bergamot oil and cornflower petals',
          basePrice: 8.50,
          isFeatured: true,
          preparationTime: '4-6 minutes',
          ingredients: ['Ceylon black tea', 'Bergamot oil', 'Cornflower petals', 'Lavender'],
          allergens: [],
          nutritionInfo: { calories: 2, caffeine: 47 },
        },
        {
          name: 'Dragon Well Green Tea',
          description: 'Delicate Chinese green tea with fresh, grassy notes',
          basePrice: 7.25,
          preparationTime: '3-4 minutes',
          ingredients: ['Dragon Well green tea leaves', 'Spring water'],
          allergens: [],
          nutritionInfo: { calories: 2, caffeine: 28 },
        },
        {
          name: 'Chamomile Dreams',
          description: 'Soothing herbal blend perfect for relaxation',
          basePrice: 6.75,
          preparationTime: '5-7 minutes',
          ingredients: ['Chamomile flowers', 'Lemon balm', 'Honey crystals'],
          allergens: [],
          nutritionInfo: { calories: 8, caffeine: 0 },
        },
      ]
    },
    // Fresh Juices
    {
      categoryName: 'Fresh Juices',
      products: [
        {
          name: 'Pomegranate Power',
          description: 'Pure pomegranate juice packed with antioxidants',
          basePrice: 11.00,
          isFeatured: true,
          preparationTime: '2-3 minutes',
          ingredients: ['Fresh pomegranate seeds', 'Apple juice', 'Lemon juice'],
          allergens: [],
          nutritionInfo: { calories: 134, sugar: 32 },
        },
        {
          name: 'Orange Sunrise',
          description: 'Freshly squeezed Valencia oranges with a hint of ginger',
          basePrice: 8.25,
          preparationTime: '2-3 minutes',
          ingredients: ['Valencia oranges', 'Fresh ginger', 'Turmeric'],
          allergens: [],
          nutritionInfo: { calories: 112, sugar: 26, protein: 2 },
        },
        {
          name: 'Green Goddess',
          description: 'Nutrient-rich blend of cucumber, celery, and green apple',
          basePrice: 9.50,
          preparationTime: '3-4 minutes',
          ingredients: ['Cucumber', 'Celery', 'Green apple', 'Lemon', 'Mint'],
          allergens: [],
          nutritionInfo: { calories: 95, sugar: 18, protein: 2 },
        },
      ]
    },
    // Specialty Smoothies
    {
      categoryName: 'Specialty Smoothies',
      products: [
        {
          name: 'Tropical Paradise',
          description: 'Mango, pineapple, and coconut milk smoothie with a tropical twist',
          basePrice: 13.75,
          isFeatured: true,
          preparationTime: '3-5 minutes',
          ingredients: ['Fresh mango', 'Pineapple chunks', 'Coconut milk', 'Banana', 'Lime juice'],
          allergens: ['Tree nuts'],
          nutritionInfo: { calories: 245, sugar: 45, protein: 4, fat: 8 },
        },
        {
          name: 'Berry Antioxidant Blast',
          description: 'Mixed berry smoothie with chia seeds and Greek yogurt',
          basePrice: 12.25,
          preparationTime: '3-5 minutes',
          ingredients: ['Mixed berries', 'Greek yogurt', 'Chia seeds', 'Honey', 'Almond milk'],
          allergens: ['Dairy', 'Tree nuts'],
          nutritionInfo: { calories: 198, sugar: 28, protein: 12, fat: 6 },
        },
        {
          name: 'Green Machine',
          description: 'Spinach, avocado, and apple smoothie for natural energy',
          basePrice: 11.50,
          preparationTime: '3-5 minutes',
          ingredients: ['Baby spinach', 'Avocado', 'Green apple', 'Pear', 'Lemon juice'],
          allergens: [],
          nutritionInfo: { calories: 185, sugar: 22, protein: 4, fat: 9 },
        },
      ]
    },
    // Iced Beverages
    {
      categoryName: 'Iced Beverages',
      products: [
        {
          name: 'Iced Hibiscus Cooler',
          description: 'Refreshing hibiscus tea served over ice with mint and lime',
          basePrice: 7.75,
          isFeatured: true,
          preparationTime: '2-3 minutes',
          ingredients: ['Hibiscus tea', 'Fresh mint', 'Lime juice', 'Agave syrup'],
          allergens: [],
          nutritionInfo: { calories: 45, sugar: 11, caffeine: 0 },
        },
        {
          name: 'Cold Brew Coffee',
          description: 'Smooth cold brew coffee served over ice with a splash of cream',
          basePrice: 8.50,
          preparationTime: '1-2 minutes',
          ingredients: ['Cold brew coffee', 'Heavy cream', 'Vanilla syrup'],
          allergens: ['Dairy'],
          nutritionInfo: { calories: 85, caffeine: 155, fat: 5 },
        },
        {
          name: 'Iced Matcha Latte',
          description: 'Premium matcha powder blended with cold milk over ice',
          basePrice: 10.25,
          preparationTime: '2-4 minutes',
          ingredients: ['Ceremonial grade matcha', 'Oat milk', 'Vanilla', 'Ice'],
          allergens: ['Tree nuts'],
          nutritionInfo: { calories: 120, sugar: 8, caffeine: 70, protein: 3 },
        },
      ]
    },
    // Signature Mocktails
    {
      categoryName: 'Signature Mocktails',
      products: [
        {
          name: 'الســـرايــا Sunset',
          description: 'Layered mocktail with passion fruit, orange, and grenadine',
          basePrice: 14.50,
          isFeatured: true,
          preparationTime: '5-7 minutes',
          ingredients: ['Passion fruit puree', 'Orange juice', 'Grenadine', 'Sparkling water', 'Mint'],
          allergens: [],
          nutritionInfo: { calories: 125, sugar: 30 },
        },
        {
          name: 'Desert Rose',
          description: 'Rose water and pomegranate mocktail with crystallized ginger',
          basePrice: 13.25,
          preparationTime: '4-6 minutes',
          ingredients: ['Rose water', 'Pomegranate juice', 'Crystallized ginger', 'Lime', 'Soda water'],
          allergens: [],
          nutritionInfo: { calories: 95, sugar: 23 },
        },
        {
          name: 'Spiced Citrus Fizz',
          description: 'Grapefruit and orange with cinnamon and cardamom',
          basePrice: 12.75,
          preparationTime: '4-5 minutes',
          ingredients: ['Fresh grapefruit', 'Orange juice', 'Cinnamon syrup', 'Cardamom', 'Tonic water'],
          allergens: [],
          nutritionInfo: { calories: 110, sugar: 26 },
        },
      ]
    }
  ];

  // Create products and variations
  for (const categoryData of productData) {
    const category = createdCategories.find(c => c.nameEn === categoryData.categoryName);
    if (!category) continue;

    for (const productInfo of categoryData.products) {
      // Check if product already exists
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
          isFeatured: productInfo.isFeatured || false,
          preparationTime: productInfo.preparationTime,
          ingredients: JSON.stringify(productInfo.ingredients),
          allergens: JSON.stringify(productInfo.allergens),
          nutritionInfo: JSON.stringify(productInfo.nutritionInfo),
          categoryId: category.id,
          createdById: admin.id,
          sortOrder: productData.indexOf(categoryData) * 10,
        },
      });

      console.log(`🍹 Product created: ${product.nameEn}`);

      // Create size variations for drinks
      const sizeVariations = [
        { name: 'Small', type: VariationType.SIZE, priceModifier: 0, isDefault: true, sortOrder: 1 },
        { name: 'Medium', type: VariationType.SIZE, priceModifier: 2.5, isDefault: false, sortOrder: 2 },
        { name: 'Large', type: VariationType.SIZE, priceModifier: 4.5, isDefault: false, sortOrder: 3 },
      ];

      for (const variation of sizeVariations) {
        await prisma.productVariation.create({
          data: {
            ...variation,
            productId: product.id,
          },
        });
      }

      // Create temperature variations for applicable drinks
      if (['Traditional Coffee', 'Premium Tea Collection', 'Iced Beverages'].includes(category.name)) {
        const tempVariations = [
          { name: 'Hot', type: VariationType.TEMPERATURE, priceModifier: 0, isDefault: category.name !== 'Iced Beverages', sortOrder: 1 },
          { name: 'Iced', type: VariationType.TEMPERATURE, priceModifier: 0, isDefault: category.name === 'Iced Beverages', sortOrder: 2 },
        ];

        for (const variation of tempVariations) {
          await prisma.productVariation.create({
            data: {
              ...variation,
              productId: product.id,
            },
          });
        }
      }

      // Create sweetness variations for some drinks
      if (['Traditional Coffee', 'Premium Tea Collection', 'Signature Mocktails'].includes(category.name)) {
        const sweetnessVariations = [
          { name: 'No Sugar', type: VariationType.SWEETNESS, priceModifier: 0, isDefault: false, sortOrder: 1 },
          { name: 'Light Sweet', type: VariationType.SWEETNESS, priceModifier: 0, isDefault: true, sortOrder: 2 },
          { name: 'Regular Sweet', type: VariationType.SWEETNESS, priceModifier: 0, isDefault: false, sortOrder: 3 },
          { name: 'Extra Sweet', type: VariationType.SWEETNESS, priceModifier: 0.5, isDefault: false, sortOrder: 4 },
        ];

        for (const variation of sweetnessVariations) {
          await prisma.productVariation.create({
            data: {
              ...variation,
              productId: product.id,
            },
          });
        }
      }
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