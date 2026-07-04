import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { PRODUCTS } from './src/data';

const app = express();
const PORT = 3000;
const STORE_PATH = path.join(process.cwd(), 'products-store.json');

// Middlewares
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Helper to get products
function getProducts() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading products store:', err);
  }
  return null;
}

// Helper to save products
function saveProducts(products: any) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving products store:', err);
    return false;
  }
}

// Initialize store if not present
if (!fs.existsSync(STORE_PATH)) {
  console.log('Initializing products store with default PRODUCTS...');
  saveProducts(PRODUCTS);
}

// API Routes
app.get('/api/products', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const products = getProducts() || PRODUCTS;
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = req.body;
  if (Array.isArray(products)) {
    saveProducts(products);
    res.json({ success: true, products });
  } else {
    res.status(400).json({ error: 'Invalid products data' });
  }
});

app.post('/api/products/reset', (req, res) => {
  saveProducts(PRODUCTS);
  res.json({ success: true, products: PRODUCTS });
});

// Vite integration
async function main() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
