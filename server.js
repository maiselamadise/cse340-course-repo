import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});