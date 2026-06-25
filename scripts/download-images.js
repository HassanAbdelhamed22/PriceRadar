import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const PRODUCTS_JSON_PATH = path.join(ROOT_DIR, 'products.json');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PRODUCTS_IMG_DIR = path.join(PUBLIC_DIR, 'images', 'products');
const BASE_IMG_DIR = path.join(PUBLIC_DIR, 'images', 'base');

// Curated high-fidelity Unsplash images for Laptops and Smartphones
const BASE_IMAGES = {
  Laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', // MacBook open side
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80', // Laptop workspace front (validated)
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80', // Black laptop open
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80', // Slim laptop dark
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80', // Laptop keyboard/chassis
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80'  // MacBook Air clean front
  ],
  Smartphones: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80', // iPhone front/back
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80', // Samsung back view
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', // Phone screen mock
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80', // Android phone setup
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80', // Phone charging screen
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=600&q=80'  // iPhone side details
  ]
};

// Helper slugify function
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

// Download image helper
async function downloadImage(url, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP status ${response.status} for URL: ${url}`);
  }

  const buffer = await response.arrayBuffer();
  await fs.promises.writeFile(dest, Buffer.from(buffer));
}

async function run() {
  try {
    console.log('Starting product image downloader and compiler...');

    // 1. Download Base Images
    console.log('Downloading base image templates...');
    const categories = Object.keys(BASE_IMAGES);
    for (const cat of categories) {
      const urls = BASE_IMAGES[cat];
      for (let i = 0; i < urls.length; i++) {
        const dest = path.join(BASE_IMG_DIR, cat.toLowerCase(), `${i + 1}.jpg`);
        if (!fs.existsSync(dest)) {
          console.log(`Downloading template: ${cat} -> image_${i + 1}.jpg`);
          await downloadImage(urls[i], dest);
        } else {
          console.log(`Template cached: ${cat} -> image_${i + 1}.jpg`);
        }
      }
    }

    // 2. Read products.json
    console.log(`Reading database at: ${PRODUCTS_JSON_PATH}`);
    const productsData = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));

    // 3. Process each product
    console.log('Compiling products with local image catalogs...');
    let processedCount = 0;

    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      const slug = slugify(product.name);
      const productDirName = `${product.id}-${slug}`;
      const productDestDir = path.join(PRODUCTS_IMG_DIR, productDirName);

      // Create product image directory
      if (!fs.existsSync(productDestDir)) {
        fs.mkdirSync(productDestDir, { recursive: true });
      }

      // Map category to base images (fallback to Laptops if mismatch)
      const baseCat = product.category === 'Smartphones' ? 'smartphones' : 'laptops';
      const baseImagesPath = path.join(BASE_IMG_DIR, baseCat);

      const localImages = [];
      // Select 4 images in rotation based on product index
      for (let j = 0; j < 4; j++) {
        const baseIndex = ((i + j) % 6) + 1; // rotate through 6 base images
        const sourcePath = path.join(baseImagesPath, `${baseIndex}.jpg`);
        const destPath = path.join(productDestDir, `${j + 1}.jpg`);

        // Copy template image locally
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, destPath);
        }

        // Add to image links
        localImages.push(`/images/products/${productDirName}/${j + 1}.jpg`);
      }

      // Update product properties
      product.images = localImages;
      product.image = localImages[0]; // main image

      processedCount++;
    }

    // 4. Save updated products.json
    console.log(`Saving updated products list back to: ${PRODUCTS_JSON_PATH}`);
    fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(productsData, null, 2), 'utf8');

    console.log(`SUCCESS! Processed ${processedCount} products successfully.`);
  } catch (e) {
    console.error('Fatal execution error:', e);
  }
}

run();
