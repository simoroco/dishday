const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  await prisma.mealHistory.deleteMany();
  await prisma.recentItem.deleteMany();
  await prisma.shoppingListItem.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  const carrefour = await prisma.store.create({
    data: {
      name: 'Carrefour',
      photo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
      mapsUrl: 'https://maps.google.com/?q=Carrefour'
    }
  });

  const auchan = await prisma.store.create({
    data: {
      name: 'Auchan',
      photo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
      mapsUrl: 'https://maps.google.com/?q=Auchan'
    }
  });

  const biocoop = await prisma.store.create({
    data: {
      name: 'Biocoop',
      photo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      mapsUrl: 'https://maps.google.com/?q=Biocoop'
    }
  });

  const eggs = await prisma.product.create({
    data: {
      name: 'Œufs',
      photo: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
      quantity: 6,
      unit: 'unités',
      storeId: carrefour.id,
      inStock: true
    }
  });

  const milk = await prisma.product.create({
    data: {
      name: 'Lait',
      photo: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      quantity: 1,
      unit: 'L',
      storeId: carrefour.id,
      inStock: true
    }
  });

  const flour = await prisma.product.create({
    data: {
      name: 'Farine',
      photo: 'https://images.unsplash.com/photo-1628690874805-0c8c8c0b8e0c?w=400',
      quantity: 1,
      unit: 'kg',
      storeId: biocoop.id,
      inStock: true
    }
  });

  const butter = await prisma.product.create({
    data: {
      name: 'Beurre',
      photo: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
      quantity: 250,
      unit: 'g',
      storeId: carrefour.id,
      inStock: true
    }
  });

  const sugar = await prisma.product.create({
    data: {
      name: 'Sucre',
      photo: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400',
      quantity: 1,
      unit: 'kg',
      storeId: auchan.id,
      inStock: false
    }
  });

  const chicken = await prisma.product.create({
    data: {
      name: 'Poulet',
      photo: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400',
      quantity: 500,
      unit: 'g',
      storeId: carrefour.id,
      inStock: true
    }
  });

  const rice = await prisma.product.create({
    data: {
      name: 'Riz',
      photo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      quantity: 1,
      unit: 'kg',
      storeId: auchan.id,
      inStock: true
    }
  });

  const tomatoes = await prisma.product.create({
    data: {
      name: 'Tomates',
      photo: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
      quantity: 500,
      unit: 'g',
      storeId: biocoop.id,
      inStock: true
    }
  });

  const onions = await prisma.product.create({
    data: {
      name: 'Oignons',
      photo: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
      quantity: 3,
      unit: 'unités',
      storeId: biocoop.id,
      inStock: true
    }
  });

  const pasta = await prisma.product.create({
    data: {
      name: 'Pâtes',
      photo: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      quantity: 500,
      unit: 'g',
      storeId: auchan.id,
      inStock: false
    }
  });

  const cheese = await prisma.product.create({
    data: {
      name: 'Fromage',
      photo: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400',
      quantity: 200,
      unit: 'g',
      storeId: carrefour.id,
      inStock: true
    }
  });

  const bread = await prisma.product.create({
    data: {
      name: 'Pain',
      photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      quantity: 1,
      unit: 'unité',
      storeId: biocoop.id,
      inStock: false
    }
  });

  const coffee = await prisma.product.create({
    data: {
      name: 'Café',
      photo: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      quantity: 250,
      unit: 'g',
      storeId: carrefour.id,
      inStock: true
    }
  });

  const orange = await prisma.product.create({
    data: {
      name: 'Oranges',
      photo: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400',
      quantity: 1,
      unit: 'kg',
      storeId: biocoop.id,
      inStock: true
    }
  });

  const yogurt = await prisma.product.create({
    data: {
      name: 'Yaourt',
      photo: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      quantity: 4,
      unit: 'unités',
      storeId: carrefour.id,
      inStock: true
    }
  });

  const omelette = await prisma.recipe.create({
    data: {
      name: 'Omelette au fromage',
      photo: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600',
      prepTime: 5,
      cookTime: 10,
      mealType: 'breakfast',
      ingredients: {
        create: [
          { productId: eggs.id, quantity: 3, unit: 'unités' },
          { productId: cheese.id, quantity: 50, unit: 'g' },
          { productId: butter.id, quantity: 10, unit: 'g' }
        ]
      }
    }
  });

  const pancakes = await prisma.recipe.create({
    data: {
      name: 'Crêpes',
      photo: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600',
      prepTime: 10,
      cookTime: 20,
      mealType: 'breakfast',
      ingredients: {
        create: [
          { productId: flour.id, quantity: 250, unit: 'g' },
          { productId: eggs.id, quantity: 3, unit: 'unités' },
          { productId: milk.id, quantity: 500, unit: 'ml' },
          { productId: butter.id, quantity: 50, unit: 'g' }
        ]
      }
    }
  });

  const chickenRice = await prisma.recipe.create({
    data: {
      name: 'Poulet au riz',
      photo: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
      prepTime: 15,
      cookTime: 30,
      mealType: 'lunch',
      ingredients: {
        create: [
          { productId: chicken.id, quantity: 400, unit: 'g' },
          { productId: rice.id, quantity: 200, unit: 'g' },
          { productId: onions.id, quantity: 1, unit: 'unité' }
        ]
      }
    }
  });

  const pastaTomato = await prisma.recipe.create({
    data: {
      name: 'Pâtes à la tomate',
      photo: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
      prepTime: 10,
      cookTime: 15,
      mealType: 'lunch',
      ingredients: {
        create: [
          { productId: pasta.id, quantity: 300, unit: 'g' },
          { productId: tomatoes.id, quantity: 400, unit: 'g' },
          { productId: onions.id, quantity: 1, unit: 'unité' },
          { productId: cheese.id, quantity: 50, unit: 'g' }
        ]
      }
    }
  });

  const grilledChicken = await prisma.recipe.create({
    data: {
      name: 'Poulet grillé aux légumes',
      photo: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600',
      prepTime: 20,
      cookTime: 40,
      mealType: 'dinner',
      ingredients: {
        create: [
          { productId: chicken.id, quantity: 500, unit: 'g' },
          { productId: tomatoes.id, quantity: 300, unit: 'g' },
          { productId: onions.id, quantity: 2, unit: 'unités' }
        ]
      }
    }
  });

  const omeletteDinner = await prisma.recipe.create({
    data: {
      name: 'Omelette aux légumes',
      photo: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600',
      prepTime: 10,
      cookTime: 15,
      mealType: 'dinner',
      ingredients: {
        create: [
          { productId: eggs.id, quantity: 4, unit: 'unités' },
          { productId: tomatoes.id, quantity: 200, unit: 'g' },
          { productId: onions.id, quantity: 1, unit: 'unité' },
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
