import { PrismaClient, UserRole, VariationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Arabic Menu Categories
const categories = [
  {
    nameEn: "Hot Drinks",
    nameAr: "مشروبات ساخنة", 
    descriptionEn: "Traditional hot beverages and herbal drinks",
    descriptionAr: "المشروبات الساخنة التقليدية والأعشاب الطبيعية",
    sortOrder: 1
  },
  {
    nameEn: "Coffee",
    nameAr: "قهوة",
    descriptionEn: "Premium coffee varieties and espresso-based drinks",
    descriptionAr: "أنواع القهوة المميزة والمشروبات المحضرة بالإسبريسو",
    sortOrder: 2
  },
  {
    nameEn: "Canned Drinks",
    nameAr: "المشروبات المعلبة",
    descriptionEn: "Soft drinks and mineral water",
    descriptionAr: "المشروبات الغازية والمياه المعدنية",
    sortOrder: 3
  },
  {
    nameEn: "Shisha",
    nameAr: "الشيشة",
    descriptionEn: "Premium hookah varieties and flavors",
    descriptionAr: "أنواع الشيشة المميزة والنكهات المختلفة",
    sortOrder: 4
  },
  {
    nameEn: "Extras",
    nameAr: "الإضافات",
    descriptionEn: "Additional toppings and sauces",
    descriptionAr: "الإضافات والصوصات المختلفة",
    sortOrder: 5
  }
];

// Hot Drinks Products
const hotDrinksProducts = [
  {
    nameEn: "Hot Cider",
    nameAr: "هوت سيدر",
    descriptionEn: "Warm spiced apple cider with cinnamon",
    descriptionAr: "عصير التفاح المتبل الدافئ مع القرفة",
    basePrice: 25,
    preparationTime: "5-7 minutes",
    ingredientsEn: '["Apple cider", "Cinnamon", "Cloves", "Orange peel"]',
    ingredientsAr: '["عصير التفاح", "القرفة", "القرنفل", "قشر البرتقال"]'
  },
  {
    nameEn: "Herbal Cocktail with Honey",
    nameAr: "كوكتيل أعشاب بالعسل",
    descriptionEn: "Mixed herbal blend sweetened with natural honey",
    descriptionAr: "خليط من الأعشاب الطبيعية محلى بالعسل الطبيعي",
    basePrice: 30,
    preparationTime: "6-8 minutes",
    ingredientsEn: '["Mixed herbs", "Natural honey", "Lemon", "Ginger"]',
    ingredientsAr: '["خليط الأعشاب", "العسل الطبيعي", "الليمون", "الزنجبيل"]'
  },
  {
    nameEn: "Cinnamon with Milk",
    nameAr: "قرفة بالحليب",
    descriptionEn: "Creamy cinnamon drink with fresh milk",
    descriptionAr: "مشروب القرفة الكريمي بالحليب الطازج",
    basePrice: 20,
    preparationTime: "4-5 minutes",
    ingredientsEn: '["Cinnamon powder", "Fresh milk", "Sugar", "Vanilla"]',
    ingredientsAr: '["مسحوق القرفة", "الحليب الطازج", "السكر", "الفانيليا"]'
  },
  {
    nameEn: "Cinnamon with Ginger",
    nameAr: "قرفة بالجنزبيل",
    descriptionEn: "Warming blend of cinnamon and fresh ginger",
    descriptionAr: "خليط مدفئ من القرفة والزنجبيل الطازج",
    basePrice: 22,
    preparationTime: "5-6 minutes",
    ingredientsEn: '["Cinnamon", "Fresh ginger", "Honey", "Lemon"]',
    ingredientsAr: '["القرفة", "الزنجبيل الطازج", "العسل", "الليمون"]'
  },
  {
    nameEn: "Plain Cinnamon",
    nameAr: "قرفة سادة",
    descriptionEn: "Pure cinnamon tea, traditional preparation",
    descriptionAr: "شاي القرفة الصافي، تحضير تقليدي",
    basePrice: 15,
    preparationTime: "3-4 minutes",
    ingredientsEn: '["Cinnamon sticks", "Water", "Sugar (optional)"]',
    ingredientsAr: '["أعواد القرفة", "الماء", "السكر (اختياري)"]'
  },
  {
    nameEn: "Plain Ginger",
    nameAr: "جنزبيل سادة",
    descriptionEn: "Fresh ginger tea for warmth and wellness",
    descriptionAr: "شاي الزنجبيل الطازج للدفء والصحة",
    basePrice: 18,
    preparationTime: "4-5 minutes",
    ingredientsEn: '["Fresh ginger root", "Water", "Honey"]',
    ingredientsAr: '["جذر الزنجبيل الطازج", "الماء", "العسل"]'
  },
  {
    nameEn: "Hot Chocolate",
    nameAr: "هوت شوكلت",
    descriptionEn: "Rich and creamy hot chocolate",
    descriptionAr: "الشوكولاتة الساخنة الغنية والكريمية",
    basePrice: 28,
    preparationTime: "3-4 minutes",
    ingredientsEn: '["Cocoa powder", "Milk", "Chocolate", "Whipped cream"]',
    ingredientsAr: '["مسحوق الكاكاو", "الحليب", "الشوكولاتة", "الكريمة المخفوقة"]'
  },
  {
    nameEn: "Sahlab with Nuts",
    nameAr: "سحلب بالمكسرات",
    descriptionEn: "Traditional Middle Eastern warm drink with mixed nuts",
    descriptionAr: "المشروب الشرق أوسطي التقليدي الدافئ مع المكسرات المشكلة",
    basePrice: 35,
    preparationTime: "8-10 minutes",
    ingredientsEn: '["Sahlab powder", "Milk", "Mixed nuts", "Coconut", "Cinnamon"]',
    ingredientsAr: '["مسحوق السحلب", "الحليب", "المكسرات المشكلة", "جوز الهند", "القرفة"]'
  },
  {
    nameEn: "Sahlab with Chocolate",
    nameAr: "سحلب بالشكولاتة",
    descriptionEn: "Creamy sahlab topped with rich chocolate",
    descriptionAr: "السحلب الكريمي مع الشوكولاتة الغنية",
    basePrice: 32,
    preparationTime: "8-10 minutes",
    ingredientsEn: '["Sahlab powder", "Milk", "Chocolate sauce", "Cocoa powder"]',
    ingredientsAr: '["مسحوق السحلب", "الحليب", "صوص الشوكولاتة", "مسحوق الكاكاو"]'
  },
  {
    nameEn: "Sahlab with Oreo",
    nameAr: "سحلب بالبوريو",
    descriptionEn: "Modern twist on traditional sahlab with Oreo cookies",
    descriptionAr: "لمسة عصرية على السحلب التقليدي مع بسكويت الأوريو",
    basePrice: 38,
    preparationTime: "8-10 minutes",
    ingredientsEn: '["Sahlab powder", "Milk", "Oreo cookies", "Chocolate chips"]',
    ingredientsAr: '["مسحوق السحلب", "الحليب", "بسكويت الأوريو", "رقائق الشوكولاتة"]'
  }
];

// Coffee Products
const coffeeProducts = [
  {
    nameEn: "Single Espresso",
    nameAr: "إسبرسو سنجل",
    descriptionEn: "Single shot of rich Italian espresso",
    descriptionAr: "جرعة واحدة من الإسبريسو الإيطالي الغني",
    basePrice: 20,
    preparationTime: "2-3 minutes",
    ingredientsEn: '["Espresso beans", "Water"]',
    ingredientsAr: '["حبوب الإسبريسو", "الماء"]'
  },
  {
    nameEn: "Double Espresso",
    nameAr: "إسبرسو دوبل",
    descriptionEn: "Double shot of intense espresso",
    descriptionAr: "جرعة مضاعفة من الإسبريسو المكثف",
    basePrice: 30,
    preparationTime: "3-4 minutes",
    ingredientsEn: '["Espresso beans", "Water"]',
    ingredientsAr: '["حبوب الإسبريسو", "الماء"]'
  },
  {
    nameEn: "Cappuccino",
    nameAr: "كابيتشينو",
    descriptionEn: "Classic cappuccino with steamed milk foam",
    descriptionAr: "الكابتشينو الكلاسيكي مع رغوة الحليب المبخر",
    basePrice: 35,
    preparationTime: "4-5 minutes",
    ingredientsEn: '["Espresso", "Steamed milk", "Milk foam"]',
    ingredientsAr: '["الإسبريسو", "الحليب المبخر", "رغوة الحليب"]'
  },
  {
    nameEn: "Mocha",
    nameAr: "موكا",
    descriptionEn: "Coffee and chocolate blend with steamed milk",
    descriptionAr: "خليط القهوة والشوكولاتة مع الحليب المبخر",
    basePrice: 40,
    preparationTime: "5-6 minutes",
    ingredientsEn: '["Espresso", "Chocolate syrup", "Steamed milk", "Whipped cream"]',
    ingredientsAr: '["الإسبريسو", "شراب الشوكولاتة", "الحليب المبخر", "الكريمة المخفوقة"]'
  },
  {
    nameEn: "Cafe Latte",
    nameAr: "كافيه لاتيه",
    descriptionEn: "Smooth espresso with steamed milk",
    descriptionAr: "الإسبريسو الناعم مع الحليب المبخر",
    basePrice: 38,
    preparationTime: "4-5 minutes",
    ingredientsEn: '["Espresso", "Steamed milk", "Light milk foam"]',
    ingredientsAr: '["الإسبريسو", "الحليب المبخر", "رغوة الحليب الخفيفة"]'
  },
  {
    nameEn: "Caramel Macchiato",
    nameAr: "ميكاتو كراميل",
    descriptionEn: "Espresso marked with caramel and steamed milk",
    descriptionAr: "الإسبريسو المميز بالكراميل والحليب المبخر",
    basePrice: 42,
    preparationTime: "5-6 minutes",
    ingredientsEn: '["Espresso", "Caramel syrup", "Steamed milk", "Caramel drizzle"]',
    ingredientsAr: '["الإسبريسو", "شراب الكراميل", "الحليب المبخر", "رذاذ الكراميل"]'
  },
  {
    nameEn: "Turkish Coffee",
    nameAr: "قهوة تركي",
    descriptionEn: "Traditional Turkish coffee prepared in copper pot",
    descriptionAr: "القهوة التركية التقليدية محضرة في الإبريق النحاسي",
    basePrice: 25,
    preparationTime: "8-10 minutes",
    ingredientsEn: '["Finely ground Turkish coffee", "Sugar", "Water"]',
    ingredientsAr: '["القهوة التركية المطحونة ناعماً", "السكر", "الماء"]'
  },
  {
    nameEn: "Nutella Coffee",
    nameAr: "نوتيلا كوفي",
    descriptionEn: "Coffee blended with rich Nutella chocolate",
    descriptionAr: "القهوة المخلوطة مع شوكولاتة النوتيلا الغنية",
    basePrice: 45,
    preparationTime: "4-5 minutes",
    ingredientsEn: '["Espresso", "Nutella", "Steamed milk", "Hazelnuts"]',
    ingredientsAr: '["الإسبريسو", "النوتيلا", "الحليب المبخر", "البندق"]'
  }
];

// Standard variations for hot drinks and coffee
const standardVariations = [
  // Size variations
  { nameEn: "Small", nameAr: "صغير", type: "SIZE", priceModifier: 0, isDefault: true },
  { nameEn: "Medium", nameAr: "متوسط", type: "SIZE", priceModifier: 5, isDefault: false },
  { nameEn: "Large", nameAr: "كبير", type: "SIZE", priceModifier: 10, isDefault: false },
  
  // Temperature variations  
  { nameEn: "Hot", nameAr: "ساخن", type: "TEMPERATURE", priceModifier: 0, isDefault: true },
  { nameEn: "Iced", nameAr: "مثلج", type: "TEMPERATURE", priceModifier: 0, isDefault: false },
  
  // Sweetness variations
  { nameEn: "No Sugar", nameAr: "بدون سكر", type: "SWEETNESS", priceModifier: 0, isDefault: false },
  { nameEn: "Light Sweet", nameAr: "سكر خفيف", type: "SWEETNESS", priceModifier: 0, isDefault: true },
  { nameEn: "Regular Sweet", nameAr: "سكر عادي", type: "SWEETNESS", priceModifier: 0, isDefault: false },
  { nameEn: "Extra Sweet", nameAr: "سكر زيادة", type: "SWEETNESS", priceModifier: 2, isDefault: false }
];

// Coffee flavor variations
const coffeeFlavorVariations = [
  { nameEn: "Caramel", nameAr: "كراميل", type: "EXTRAS", priceModifier: 5, isDefault: false },
  { nameEn: "Hazelnut", nameAr: "بندق", type: "EXTRAS", priceModifier: 5, isDefault: false },
  { nameEn: "Vanilla", nameAr: "فانيليا", type: "EXTRAS", priceModifier: 5, isDefault: false },
  { nameEn: "Chocolate", nameAr: "شوكولاتة", type: "EXTRAS", priceModifier: 5, isDefault: false }
];

async function seedDatabase() {
  console.log('🌱 Starting bilingual Arabic menu seeding...');

  try {
    // Clear existing data
    await prisma.productVariation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.menuConfig.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@saraya.com',
        password: hashedPassword,
        firstName: 'Saraya',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
      },
    });

    console.log('👤 Admin user created: admin@saraya.com');

    // Create menu configuration
    await prisma.menuConfig.create({
      data: {
        restaurantNameEn: 'Saraya Drinks',
        restaurantNameAr: 'سرايا للمشروبات',
        restaurantDescriptionEn: 'Authentic Middle Eastern drinks and traditional flavors',
        restaurantDescriptionAr: 'المشروبات الشرق أوسطية الأصيلة والنكهات التقليدية',
        primaryColor: '#723713',
        secondaryColor: '#b58350',
        defaultLanguage: 'ar',
        menuUrl: 'http://localhost:3000',
        openingHours: JSON.stringify({
          en: 'Daily 8:00 AM - 12:00 AM',
          ar: 'يومياً من ٨ صباحاً حتى ١٢ منتصف الليل'
        }),
      },
    });

    console.log('⚙️ Bilingual menu configuration created');

    // Create categories
    const createdCategories = [];
    for (const category of categories) {
      const createdCategory = await prisma.category.create({
        data: {
          ...category,
          createdById: admin.id,
        },
      });
      createdCategories.push(createdCategory);
      console.log(`📂 Category created: ${category.nameEn} / ${category.nameAr}`);
    }

    // Create Hot Drinks products
    const hotDrinksCategory = createdCategories.find(c => c.nameEn === 'Hot Drinks');
    if (hotDrinksCategory) {
      for (const productInfo of hotDrinksProducts) {
        const product = await prisma.product.create({
          data: {
            ...productInfo,
            categoryId: hotDrinksCategory.id,
            createdById: admin.id,
            isFeatured: Math.random() > 0.7, // Randomly feature some products
          },
        });

        // Add standard variations for hot drinks
        for (const variation of standardVariations) {
          await prisma.productVariation.create({
            data: {
              ...variation,
              productId: product.id,
              type: variation.type as VariationType,
            },
          });
        }

        console.log(`🍹 Hot drink created: ${productInfo.nameEn} / ${productInfo.nameAr}`);
      }
    }

    // Create Coffee products
    const coffeeCategory = createdCategories.find(c => c.nameEn === 'Coffee');
    if (coffeeCategory) {
      for (const productInfo of coffeeProducts) {
        const product = await prisma.product.create({
          data: {
            ...productInfo,
            categoryId: coffeeCategory.id,
            createdById: admin.id,
            isFeatured: Math.random() > 0.6, // Coffee is more likely to be featured
          },
        });

        // Add standard variations
        for (const variation of standardVariations) {
          await prisma.productVariation.create({
            data: {
              ...variation,
              productId: product.id,
              type: variation.type as VariationType,
            },
          });
        }

        // Add coffee flavor variations for cappuccino, latte, etc.
        if (['Cappuccino', 'Cafe Latte', 'Mocha'].includes(productInfo.nameEn)) {
          for (const flavorVariation of coffeeFlavorVariations) {
            await prisma.productVariation.create({
              data: {
                ...flavorVariation,
                productId: product.id,
                type: flavorVariation.type as VariationType,
              },
            });
          }
        }

        console.log(`☕ Coffee created: ${productInfo.nameEn} / ${productInfo.nameAr}`);
      }
    }

    console.log('✅ Bilingual Arabic menu seeding completed successfully!');
    console.log('🎯 Login credentials: admin@saraya.com / admin123');
    console.log('🌐 Default language: Arabic (العربية)');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });