import express from 'express';

import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'development';
const PORT = process.env.PORT || 3000;

const app = express();

/**
 * Static Middleware
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * EJS Configuration
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';

    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';

    res.render('organizations', { title });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';

    res.render('projects', { title });
});

app.get('/categories', async (req, res) => {
    const title = 'Service Project Categories';

    res.render('categories', { title });
});

/**
 * Server
 */
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit with failure code if database connection fails
  }
});