const { PrismaClient } = require('@prisma/client');
const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const prisma = new PrismaClient();
const IMAGES_DIR = path.join(__dirname, '../server/data/images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const UNSPLASH_IMAGES = {
  stores: {
    'Walmart': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800',
    'Whole Foods': 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800',
    'Costco': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800'
  },
  products: {
    'Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800',
    'Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
    'Flour': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800',
    'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800',
    'Sugar': 'https://images.unsplash.com/photo-1514568063297-c87e33f61c3e?w=800',
    'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800',
    'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
    'Tomatoes': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800',
    'Onions': 'https://images.unsplash.com/photo-1587049352846-4a222e784210?w=800',
    'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    'Cheese': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800',
    'Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'
  },
  recipes: {
    'Cheese Omelette': 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800',
    'Pancakes': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    'Chicken with Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    'Pasta with Tomato Sauce': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    'Grilled Chicken with Vegetables': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    'Vegetable Omelette': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800'
  }
};

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const filepath = path.join(IMAGES_DIR, filename);
          
          await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(filepath);
          
          console.log(`✓ Downloaded: ${filename}`);
          resolve(`/images/${filename}`);
        } catch (error) {
          console.error(`✗ Error processing ${filename}:`, error.message);
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🖼️  Downloading images from Unsplash...\n');

  let count = 0;

  // Download store images
  const stores = await prisma.store.findMany();
  for (const store of stores) {
    if (UNSPLASH_IMAGES.stores[store.name]) {
      try {
        const filename = `store-${store.id}.jpg`;
        const path = await downloadImage(UNSPLASH_IMAGES.stores[store.name], filename);
        await prisma.store.update({
          where: { id: store.id },
          data: { photo: path }
        });
        count++;
      } catch (error) {
        console.error(`Failed to download image for store ${store.name}`);
      }
    }
  }

  // Download product images
  const products = await prisma.product.findMany();
  for (const product of products) {
    if (UNSPLASH_IMAGES.products[product.name]) {
      try {
        const filename = `product-${product.id}.jpg`;
        const path = await downloadImage(UNSPLASH_IMAGES.products[product.name], filename);
        await prisma.product.update({
          where: { id: product.id },
          data: { photo: path }
        });
        count++;
      } catch (error) {
        console.error(`Failed to download image for product ${product.name}`);
      }
    }
  }

  // Download recipe images
  const recipes = await prisma.recipe.findMany();
  for (const recipe of recipes) {
    if (UNSPLASH_IMAGES.recipes[recipe.name]) {
      try {
        const filename = `recipe-${recipe.id}.jpg`;
        const path = await downloadImage(UNSPLASH_IMAGES.recipes[recipe.name], filename);
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { photo: path }
        });
        count++;
      } catch (error) {
        console.error(`Failed to download image for recipe ${recipe.name}`);
      }
    }
  }

  console.log(`\n✅ Downloaded ${count} images successfully!`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
