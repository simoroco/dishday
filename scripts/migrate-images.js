const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const prisma = new PrismaClient();
const IMAGES_DIR = path.join(__dirname, '../server/data/images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const filepath = path.join(IMAGES_DIR, filename);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(filepath);
          console.log(`✓ Downloaded and resized: ${filename}`);
          resolve(filename);
        } catch (error) {
          console.error(`✗ Error processing ${filename}:`, error.message);
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function migrateImages() {
  console.log('🖼️  Starting image migration...\n');

  const stores = await prisma.store.findMany();
  const products = await prisma.product.findMany();
  const recipes = await prisma.recipe.findMany();

  let count = 0;

  for (const store of stores) {
    if (store.photo && store.photo.startsWith('http')) {
      try {
        const filename = `store-${store.id}.jpg`;
        await downloadImage(store.photo, filename);
        await prisma.store.update({
          where: { id: store.id },
          data: { photo: `/images/${filename}` }
        });
        count++;
      } catch (error) {
        console.error(`Failed to migrate store ${store.id}:`, error.message);
      }
    }
  }

  for (const product of products) {
    if (product.photo && product.photo.startsWith('http')) {
      try {
        const filename = `product-${product.id}.jpg`;
        await downloadImage(product.photo, filename);
        await prisma.product.update({
          where: { id: product.id },
          data: { photo: `/images/${filename}` }
        });
        count++;
      } catch (error) {
        console.error(`Failed to migrate product ${product.id}:`, error.message);
      }
    }
  }

  for (const recipe of recipes) {
    if (recipe.photo && recipe.photo.startsWith('http')) {
      try {
        const filename = `recipe-${recipe.id}.jpg`;
        await downloadImage(recipe.photo, filename);
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { photo: `/images/${filename}` }
        });
        count++;
      } catch (error) {
        console.error(`Failed to migrate recipe ${recipe.id}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Migration complete! ${count} images migrated.`);
  await prisma.$disconnect();
}

migrateImages().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
