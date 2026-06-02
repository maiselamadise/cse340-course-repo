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

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Main routes
router.get('/', showHomePage);

// Organizations
router.get('/organizations', showOrganizationsPage);

router.get('/organization/:id', showOrganizationDetails);

router.get('/new-organization', showNewOrganizationForm);

router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', organizationIdValidation, showEditOrganizationForm);

router.post('/edit-organization/:id', organizationIdValidation, organizationValidation, processEditOrganizationForm);

// Projects
router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetails);

router.get('/new-project', showNewProjectForm);

router.post('/new-project', projectValidation, processNewProjectForm);

router.get('/edit-project/:id', projectIdValidation, showEditProjectForm);

router.post('/edit-project/:id', projectIdValidation, projectValidation, processEditProjectForm);

// Categories
router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetails);

router.get('/new-category', showNewCategoryForm);

router.post('/new-category', categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', categoryIdValidation, showEditCategoryForm);

router.post('/edit-category/:id', categoryIdValidation, categoryValidation, processEditCategoryForm);

router.get('/assign-categories/:projectId', assignCategoriesValidation, showAssignCategoriesForm);

router.post('/assign-categories/:projectId', assignCategoriesValidation, processAssignCategoriesForm);

// Error testing route
router.get('/test-error', testErrorPage);

export default router;
