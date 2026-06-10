import bcrypt from 'bcrypt';
import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

/* =========================
   SHOW REGISTER PAGE
========================= */

const showUserRegistrationForm = (req, res) => {

    res.render('register', {
        title: 'Register'
    });
};

/* =========================
   PROCESS REGISTRATION
========================= */

const processUserRegistrationForm = async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    try {

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            password,
            salt
        );

        // Create user
        await createUser(
            name,
            email,
            passwordHash
        );

        req.flash(
            'success',
            'Registration successful! Please log in.'
        );

        return res.redirect('/login');

    } catch (error) {

        console.error(
            'Error registering user:',
            error
        );

        req.flash(
            'error',
            'Registration failed. Please try again.'
        );

        return res.redirect('/register');
    }
};

/* =========================
   SHOW LOGIN PAGE
========================= */

const showLoginForm = (req, res) => {

    res.render('login', {
        title: 'Login'
    });
};

/* =========================
   PROCESS LOGIN
========================= */

const processLoginForm = async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {

        const user = await authenticateUser(
            email,
            password
        );

        // Invalid login
        if (!user) {

            req.flash(
                'error',
                'Invalid email or password.'
            );

            return res.redirect('/login');
        }

        // Save user in session
        req.session.user = {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash(
            'success',
            'Login successful!'
        );

        console.log(
            'User logged in:',
            req.session.user
        );

        return res.redirect('/dashboard');

    } catch (error) {

        console.error(
            'Error during login:',
            error
        );

        req.flash(
            'error',
            'Login failed. Please try again.'
        );

        return res.redirect('/login');
    }
};

/* =========================
   PROCESS LOGOUT
========================= */

const processLogout = (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                'Error during logout:',
                error
            );

            req.flash(
                'error',
                'Logout failed.'
            );

            return res.redirect('/');
        }

        res.redirect('/login');
    });
};

/* =========================
   REQUIRE LOGIN
========================= */

const requireLogin = (req, res, next) => {

    if (
        !req.session ||
        !req.session.user
    ) {

        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    next();
};

/* =========================
   REQUIRE ROLE
========================= */

const requireRole = (role) => {

    return (req, res, next) => {

        // Must be logged in
        if (
            !req.session ||
            !req.session.user
        ) {

            req.flash(
                'error',
                'You must be logged in.'
            );

            return res.redirect('/login');
        }

        // Check role
        if (
            req.session.user.role !== role
        ) {

            req.flash(
                'error',
                'Access denied.'
            );

            return res.redirect('/dashboard');
        }

        next();
    };
};

/* =========================
   DASHBOARD
========================= */

const showDashboard = (req, res) => {

    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        role: user.role
    });
};

/* =========================
   USERS LIST (ADMIN)
========================= */

const showUsersPage = async (req, res, next) => {

    try {

        const users = await getAllUsers();

        res.render('users', {
            title: 'Registered Users',
            users
        });

    } catch (error) {

        next(error);
    }
};

/* =========================
   EXPORTS
========================= */

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};