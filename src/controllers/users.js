import bcrypt from 'bcryptjs';
import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

import { getVolunteerProjectsByUserId } from '../models/volunteers.js';

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

    const { name, email, password } = req.body;

    try {

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            password,
            salt
        );

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

        if (error.code === '23505') {

            req.flash(
                'error',
                'That email address is already registered.'
            );

            return res.redirect('/register');
        }

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

    const { email, password } = req.body;

    try {

        const user = await authenticateUser(
            email,
            password
        );

        if (!user) {

            req.flash(
                'error',
                'Invalid email or password.'
            );

            return res.redirect('/login');
        }

        req.session.user = {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.session.save((error) => {

            if (error) {

                console.error(
                    'Session save error:',
                    error
                );

                req.flash(
                    'error',
                    'Login failed. Please try again.'
                );

                return res.redirect('/login');
            }

            req.flash(
                'success',
                `Welcome back, ${user.name}!`
            );

            return res.redirect('/dashboard');
        });

    } catch (error) {

        console.error(
            'Login error:',
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
                'Logout error:',
                error
            );

            return res.redirect('/');
        }

        return res.redirect('/login');
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

        if (
            req.session.user.role !== role
        ) {

            req.flash(
                'error',
                'Access denied. Admin privileges required.'
            );

            return res.redirect('/dashboard');
        }

        next();
    };
};

/* =========================
   DASHBOARD
========================= */

const showDashboard = async (req, res, next) => {

    const user = req.session.user;

    try {

        const volunteerProjects = await getVolunteerProjectsByUserId(user.id);

        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            role: user.role,
            volunteerProjects
        });

    } catch (error) {

        console.error(
            'Dashboard error:',
            error
        );

        next(error);
    }
};

/* =========================
   USERS PAGE (ADMIN)
========================= */

const showUsersPage = async (req, res, next) => {

    try {

        const users = await getAllUsers();

        res.render('users', {
            title: 'Registered Users',
            users
        });

    } catch (error) {

        console.error(
            'Users page error:',
            error
        );

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
