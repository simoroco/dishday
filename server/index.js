const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/stores', async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: { products: true }
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: true }
    });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stores', async (req, res) => {
  try {
    const { name, photo, mapsUrl } = req.body;
    const store = await prisma.store.create({
      data: { name, photo, mapsUrl }
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/stores/:id', async (req, res) => {
  try {
    const { name, photo, mapsUrl } = req.body;
    const store = await prisma.store.update({
      where: { id: parseInt(req.params.id) },
      data: { name, photo, mapsUrl }
    });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/stores/:id', async (req, res) => {
  try {
    await prisma.store.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { search, storeId, inStock } = req.query;
    const where = {};
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (storeId) {
      where.storeId = parseInt(storeId);
    }
    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      include: { store: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { store: true }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, photo, quantity, unit, storeId, inStock } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        photo,
        quantity: quantity ? parseFloat(quantity) : null,
        unit,
        storeId: storeId ? parseInt(storeId) : null,
        inStock: inStock || false
      },
      include: { store: true }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, photo, quantity, unit, storeId, inStock } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        photo,
        quantity: quantity ? parseFloat(quantity) : null,
        unit,
        storeId: storeId ? parseInt(storeId) : null,
        inStock
      },
      include: { store: true }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const { search, mealType } = req.query;
    const where = {};
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (mealType) {
      where.mealType = mealType;
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: {
          include: { product: true }
        }
      }
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        ingredients: {
          include: { product: true }
        }
      }
    });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const { name, photo, prepTime, cookTime, mealType, ingredients } = req.body;
    const recipe = await prisma.recipe.create({
      data: {
        name,
        photo,
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        mealType,
        ingredients: {
          create: ingredients?.map(ing => ({
            productId: ing.productId,
            quantity: ing.quantity ? parseFloat(ing.quantity) : null,
            unit: ing.unit
          })) || []
        }
      },
      include: {
        ingredients: {
          include: { product: true }
        }
      }
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { name, photo, prepTime, cookTime, mealType, ingredients } = req.body;
    
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: parseInt(req.params.id) }
    });

    const recipe = await prisma.recipe.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        photo,
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        mealType,
        ingredients: {
          create: ingredients?.map(ing => ({
            productId: ing.productId,
            quantity: ing.quantity ? parseFloat(ing.quantity) : null,
            unit: ing.unit
          })) || []
        }
      },
      include: {
        ingredients: {
          include: { product: true }
        }
      }
    });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    await prisma.recipe.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/meal-suggestion', async (req, res) => {
  try {
    const hour = new Date().getHours();
    let mealType;
    
    if (hour >= 6 && hour < 11) {
      mealType = 'breakfast';
    } else if (hour >= 11 && hour < 17) {
      mealType = 'lunch';
    } else {
      mealType = 'dinner';
    }

    const recentHistory = await prisma.mealHistory.findMany({
      where: {
        proposedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      select: { recipeId: true }
    });

    const excludeIds = recentHistory.map(h => h.recipeId);

    const recipes = await prisma.recipe.findMany({
      where: {
        mealType,
        id: { notIn: excludeIds }
      },
      include: {
        ingredients: {
          include: { product: true }
        }
      }
    });

    if (recipes.length === 0) {
      const allRecipes = await prisma.recipe.findMany({
        where: { mealType },
        include: {
          ingredients: {
            include: { product: true }
          }
        }
      });
      
      if (allRecipes.length === 0) {
        return res.status(404).json({ error: 'No recipes found for this meal type' });
      }
      
      const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      
      await prisma.mealHistory.create({
        data: { recipeId: randomRecipe.id }
      });
      
      return res.json(randomRecipe);
    }

    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    
    await prisma.mealHistory.create({
      data: { recipeId: randomRecipe.id }
    });

    res.json(randomRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/shopping-list', async (req, res) => {
  try {
    const items = await prisma.shoppingListItem.findMany({
      include: {
        product: {
          include: { store: true }
        }
      },
      orderBy: { addedAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/shopping-list', async (req, res) => {
  try {
    const { productId } = req.body;
    
    const existing = await prisma.shoppingListItem.findUnique({
      where: { productId: parseInt(productId) }
    });

    if (existing) {
      return res.json(existing);
    }

    const item = await prisma.shoppingListItem.create({
      data: { productId: parseInt(productId) },
      include: {
        product: {
          include: { store: true }
        }
      }
    });

    await prisma.recentItem.upsert({
      where: { productId: parseInt(productId) },
      update: { lastUsed: new Date() },
      create: { productId: parseInt(productId) }
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/shopping-list/:productId', async (req, res) => {
  try {
    await prisma.shoppingListItem.delete({
      where: { productId: parseInt(req.params.productId) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recent-items', async (req, res) => {
  try {
    const items = await prisma.recentItem.findMany({
      include: {
        product: {
          include: { store: true }
        }
      },
      orderBy: { lastUsed: 'desc' },
      take: 10
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
