import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetails,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetails
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetails
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Main routes
router.get('/', showHomePage);

// Organizations
router.get('/organizations', showOrganizationsPage);

router.get('/organization/:id', showOrganizationDetails);

// Projects
router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetails);

// Categories
router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetails);

// Error testing route
router.get('/test-error', testErrorPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

export default router;