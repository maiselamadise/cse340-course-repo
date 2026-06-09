import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetails,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation,
    organizationIdValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetails,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    projectIdValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetails,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation,
    categoryIdValidation,
    assignCategoriesValidation
} from './controllers/categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/* =========================
   HOME
========================= */

router.get('/', showHomePage);

/* =========================
   ORGANIZATIONS
========================= */

// List all organizations
router.get(
    '/organizations',
    showOrganizationsPage
);

// View single organization
router.get(
    '/organization/:id',
    showOrganizationDetails
);

// Show new organization form
router.get(
    '/new-organization',
    requireRole('admin'),
    showNewOrganizationForm
);

// Process new organization form
router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

// Show edit organization form
router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationIdValidation,
    showEditOrganizationForm
);

// Process edit organization form
router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationIdValidation,
    organizationValidation,
    processEditOrganizationForm
);

/* =========================
   PROJECTS
========================= */

// List all projects
router.get(
    '/projects',
    showProjectsPage
);

// View single project
router.get(
    '/project/:id',
    showProjectDetails
);

// Show new project form
router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

// Process new project form
router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

// Show edit project form
router.get(
    '/edit-project/:id',
    requireRole('admin'),
    projectIdValidation,
    showEditProjectForm
);

// Process edit project form
router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectIdValidation,
    projectValidation,
    processEditProjectForm
);

/* =========================
   CATEGORIES
========================= */

// List all categories
router.get(
    '/categories',
    showCategoriesPage
);

// View single category
router.get(
    '/category/:id',
    showCategoryDetails
);

// Show new category form
router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

// Process new category form
router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

// Show edit category form
router.get(
    '/edit-category/:id',
    requireRole('admin'),
    categoryIdValidation,
    showEditCategoryForm
);

// Process edit category form
router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryIdValidation,
    categoryValidation,
    processEditCategoryForm
);

// Show assign categories form
router.get(
    '/assign-categories/:projectId',
    requireRole('admin'),
    assignCategoriesValidation,
    showAssignCategoriesForm
);

// Process assign categories form
router.post(
    '/assign-categories/:projectId',
    requireRole('admin'),
    assignCategoriesValidation,
    processAssignCategoriesForm
);

/* =========================
   USERS
========================= */

// Registration
router.get(
    '/register',
    showUserRegistrationForm
);

router.post(
    '/register',
    processUserRegistrationForm
);

// Login
router.get(
    '/login',
    showLoginForm
);

router.post(
    '/login',
    processLoginForm
);

// Logout
router.get(
    '/logout',
    processLogout
);

// Dashboard
router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);

/* =========================
   ERROR TESTING
========================= */

router.get(
    '/test-error',
    testErrorPage
);

export default router;
