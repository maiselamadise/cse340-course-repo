import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);

        req.flash(
            'error',
            'An error occurred during registration. Please try again.'
        );

        return res.redirect('/register');
    }
};

/**
 * Show login form
 */
const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

/**
 * Process login form
 */
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            // Store user in session
            req.session.user = user;

            req.flash('success', 'Login successful!');

            console.log('User logged in:', user);

            return res.redirect('/dashboard');
        }

        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');

    } catch (error) {
        console.error('Error during login:', error);

        req.flash(
            'error',
            'An error occurred during login. Please try again.'
        );

        return res.redirect('/login');
    }
};

/**
 * Process logout
 */
const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);

            req.flash('error', 'Logout failed.');

            return res.redirect('/');
        }

        res.redirect('/login');
    });
};

/**
 * Middleware to protect routes
 */
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    next();
};

/**
 * Show dashboard page
 */
const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
};