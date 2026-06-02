import { body, param, validationResult } from 'express-validator';

import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('logoFilename')
        .optional({ values: 'falsy' })
        .trim()
        .notEmpty()
        .withMessage('Logo filename is required')
        .isLength({ max: 255 })
        .withMessage('Logo filename cannot exceed 255 characters')
];

const organizationIdValidation = [
    param('id')
        .isInt().withMessage('Invalid organization ID')
];

const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title: 'Organizations',
            organizations
        });
    } catch (err) {
        next(err);
    }
};

const showOrganizationDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const organization = await getOrganizationDetails(id);

        if (!organization) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(id);

        res.render('organizationDetails', {
            title: organization.name,
            organization,
            projects
        });
    } catch (err) {
        next(err);
    }
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', {
        title
    });
};

const showEditOrganizationForm = async (req, res, next) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/organizations');
    }

    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }

        const title = 'Edit Organization';

        res.render('edit-organization', { title, organizationDetails });
    } catch (err) {
        next(err);
    }
};

const processEditOrganizationForm = async (req, res, next) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/edit-organization/' + req.params.id);
    }

    try {
        const organizationId = req.params.id;
        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization updated successfully!');

        res.redirect(`/organization/${organizationId}`);
    } catch (err) {
        next(err);
    }
};

const processNewOrganizationForm = async (req, res, next) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-organization');
    }

    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization added successfully!');

        res.redirect(`/organization/${organizationId}`);
    } catch (err) {
        next(err);
    }
};

export {
    showOrganizationsPage,
    showOrganizationDetails,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation,
    organizationIdValidation
};