const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Checking if seed is needed...');

  // Check if database already has data
  const storeCount = await prisma.store.count();
  
  if (storeCount > 0) {
    console.log('✅ Database already seeded, skipping...');
    return;
  }

  console.log('🌱 Starting seed...');

  await prisma.mealHistory.deleteMany();
  await prisma.recentItem.deleteMany();
  await prisma.shoppingListItem.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  const walmart = await prisma.store.create({
    data: {
      name: 'Walmart',
      photo: null,
      mapsUrl: 'https://maps.google.com/?q=Walmart',
      notes: 'Main grocery store'
    }
  });

  const wholefoods = await prisma.store.create({
    data: {
      name: 'Whole Foods',
      photo: null,
      mapsUrl: 'https://maps.google.com/?q=Whole+Foods',
      notes: 'Organic products'
    }
  });

  const costco = await prisma.store.create({
    data: {
      name: 'Costco',
      photo: null,
      mapsUrl: 'https://maps.google.com/?q=Costco',
      notes: 'Bulk shopping'
    }
  });

  const eggs = await prisma.product.create({
    data: {
      name: 'Eggs',
      photo: null,
      quantity: 12,
      unit: 'units',
      storeId: walmart.id,
      inStock: true,
      notes: 'Free range'
    }
  });

  const milk = await prisma.product.create({
    data: {
      name: 'Milk',
      photo: null,
      quantity: 1,
      unit: 'L',
      storeId: walmart.id,
      inStock: true,
      notes: 'Whole milk'
    }
  });

  const flour = await prisma.product.create({
    data: {
      name: 'Flour',
      photo: null,
      quantity: 1,
      unit: 'kg',
      storeId: wholefoods.id,
      inStock: true,
      notes: 'All-purpose'
    }
  });

  const butter = await prisma.product.create({
    data: {
      name: 'Butter',
      photo: null,
      quantity: 250,
      unit: 'g',
      storeId: walmart.id,
      inStock: true,
      notes: 'Unsalted'
    }
  });

  const sugar = await prisma.product.create({
    data: {
      name: 'Sugar',
      photo: null,
      quantity: 1,
      unit: 'kg',
      storeId: costco.id,
      inStock: false,
      notes: 'White sugar'
    }
  });

  const chicken = await prisma.product.create({
    data: {
      name: 'Chicken Breast',
      photo: null,
      quantity: 500,
      unit: 'g',
      storeId: walmart.id,
      inStock: true,
      notes: 'Fresh'
    }
  });

  const rice = await prisma.product.create({
    data: {
      name: 'Rice',
      photo: null,
      quantity: 1,
      unit: 'kg',
      storeId: costco.id,
      inStock: true,
      notes: 'Basmati'
    }
  });

  const tomatoes = await prisma.product.create({
    data: {
      name: 'Tomatoes',
      photo: null,
      quantity: 500,
      unit: 'g',
      storeId: wholefoods.id,
      inStock: true,
      notes: 'Organic'
    }
  });

  const onions = await prisma.product.create({
    data: {
      name: 'Onions',
      photo: null,
      quantity: 3,
      unit: 'units',
      storeId: wholefoods.id,
      inStock: true,
      notes: 'Yellow onions'
    }
  });

  const pasta = await prisma.product.create({
    data: {
      name: 'Pasta',
      photo: null,
      quantity: 500,
      unit: 'g',
      storeId: costco.id,
      inStock: false,
      notes: 'Spaghetti'
    }
  });

  const cheese = await prisma.product.create({
    data: {
      name: 'Cheese',
      photo: null,
      quantity: 200,
      unit: 'g',
      storeId: walmart.id,
      inStock: true,
      notes: 'Cheddar'
    }
  });

  const bread = await prisma.product.create({
    data: {
      name: 'Bread',
      photo: null,
      quantity: 1,
      unit: 'units',
      storeId: wholefoods.id,
      inStock: false,
      notes: 'Whole wheat'
    }
  });

  const omelette = await prisma.recipe.create({
    data: {
      name: 'Cheese Omelette',
      photo: null,
      prepTime: 5,
      cookTime: 10,
      mealType: 'breakfast',
      notes: 'Quick and easy breakfast',
      ingredients: {
        create: [
          { productId: eggs.id, quantity: 3, unit: 'units' },
          { productId: cheese.id, quantity: 50, unit: 'g' },
          { productId: butter.id, quantity: 10, unit: 'g' }
        ]
      }
    }
  });

  const pancakes = await prisma.recipe.create({
    data: {
      name: 'Pancakes',
      photo: null,
      prepTime: 10,
      cookTime: 20,
      mealType: 'breakfast',
      notes: 'Fluffy pancakes',
      ingredients: {
        create: [
          { productId: flour.id, quantity: 250, unit: 'g' },
          { productId: eggs.id, quantity: 2, unit: 'units' },
          { productId: milk.id, quantity: 300, unit: 'ml' },
          { productId: butter.id, quantity: 50, unit: 'g' }
        ]
      }
    }
  });

  const chickenRice = await prisma.recipe.create({
    data: {
      name: 'Chicken with Rice',
      photo: null,
      prepTime: 15,
      cookTime: 30,
      mealType: 'lunch',
      notes: 'Healthy and filling',
      ingredients: {
        create: [
          { productId: chicken.id, quantity: 400, unit: 'g' },
          { productId: rice.id, quantity: 200, unit: 'g' },
          { productId: onions.id, quantity: 1, unit: 'units' }
        ]
      }
    }
  });

  const pastaTomato = await prisma.recipe.create({
    data: {
      name: 'Pasta with Tomato Sauce',
      photo: null,
      prepTime: 10,
      cookTime: 15,
      mealType: 'lunch',
      notes: 'Classic Italian',
      ingredients: {
        create: [
          { productId: pasta.id, quantity: 300, unit: 'g' },
          { productId: tomatoes.id, quantity: 400, unit: 'g' },
          { productId: onions.id, quantity: 1, unit: 'units' },
          { productId: cheese.id, quantity: 50, unit: 'g' }
        ]
      }
    }
  });

  const grilledChicken = await prisma.recipe.create({
    data: {
      name: 'Grilled Chicken with Vegetables',
      photo: null,
      prepTime: 20,
      cookTime: 40,
      mealType: 'dinner',
      notes: 'Healthy dinner option',
      ingredients: {
        create: [
          { productId: chicken.id, quantity: 500, unit: 'g' },
          { productId: tomatoes.id, quantity: 300, unit: 'g' },
          { productId: onions.id, quantity: 2, unit: 'units' }
        ]
      }
    }
  });

  const vegetableOmelette = await prisma.recipe.create({
    data: {
      name: 'Vegetable Omelette',
      photo: null,
      prepTime: 10,
      cookTime: 15,
      mealType: 'dinner',
      notes: 'Light dinner',
      ingredients: {
        create: [
          { productId: eggs.id, quantity: 4, unit: 'units' },
          { productId: tomatoes.id, quantity: 200, unit: 'g' },
          { productId: onions.id, quantity: 1, unit: 'units' },
          { productId: cheese.id, quantity: 100, unit: 'g' }
        ]
      }
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created ${await prisma.store.count()} stores`);
  console.log(`Created ${await prisma.product.count()} products`);
  console.log(`Created ${await prisma.recipe.count()} recipes`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
