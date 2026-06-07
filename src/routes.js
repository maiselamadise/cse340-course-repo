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

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetails);

router.get(
    '/new-organization',
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    organizationIdValidation,
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    organizationIdValidation,
    organizationValidation,
    processEditOrganizationForm
);

/* =========================
   PROJECTS
========================= */

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetails);

router.get(
    '/new-project',
    showNewProjectForm
);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get(
    '/edit-project/:id',
    projectIdValidation,
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    projectIdValidation,
    projectValidation,
    processEditProjectForm
);

/* =========================
   CATEGORIES
========================= */

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetails);

router.get(
    '/new-category',
    showNewCategoryForm
);

router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    categoryIdValidation,
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    categoryIdValidation,
    categoryValidation,
    processEditCategoryForm
);

router.get(
    '/assign-categories/:projectId',
    assignCategoriesValidation,
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
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

// Protected Dashboard
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