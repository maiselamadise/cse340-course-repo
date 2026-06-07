import { body, param, validationResult } from 'express-validator';

import {
    getUpcomingProjects,
    getProjectById,
    createProject,
    updateProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 150 }).withMessage('Title must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 255 }).withMessage('Location must be less than 255 characters'),
    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid date format'),
    body('endDate')
        .optional({ values: 'falsy' })
        .isISO8601().withMessage('End date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const projectIdValidation = [
    param('id')
        .isInt().withMessage('Invalid project ID')
];

export const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects();

        res.render('projects', {
            title: 'Projects',
            projects
        });
    } catch (err) {
        next(err);
    }
};

export const showProjectDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await getProjectById(id);

        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        const categories = await getCategoriesByProjectId(id);

        res.render('projectDetails', {
            title: project.title,
            project,
            categories
        });
    } catch (err) {
        next(err);
    }
};

export const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';

        res.render('new-project', { title, organizations });
    } catch (err) {
        next(err);
    }
};

export const processNewProjectForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, startDate, endDate, organizationId } = req.body;

    try {
        await createProject(title, description, location, startDate, endDate, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

export const showEditProjectForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/projects');
    }

    try {
        const { id } = req.params;
        const project = await getProjectById(id);

        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        const organizations = await getAllOrganizations();
        const title = 'Edit Service Project';

        res.render('edit-project', { title, project, organizations });
    } catch (err) {
        next(err);
    }
};

export const processEditProjectForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const { title, description, location, startDate, endDate, organizationId } = req.body;
    const { id } = req.params;

    try {
        await updateProject(id, title, description, location, startDate, endDate, organizationId);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${id}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${id}`);
    }
};

export { projectValidation, projectIdValidation };
