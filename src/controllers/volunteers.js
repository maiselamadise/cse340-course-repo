import { param, validationResult } from 'express-validator';

import {
    addVolunteer,
    removeVolunteer,
    isUserVolunteering
} from '../models/volunteers.js';

import { getProjectById } from '../models/projects.js';

export const volunteerIdValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid project ID')
];

export const processVolunteer = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', 'Invalid project.');
        return res.redirect('/projects');
    }

    const { id } = req.params;

    const userId = req.session.user.user_id;

    try {
        const project = await getProjectById(id);

        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;

            return next(err);
        }

        const alreadyVolunteering =
            await isUserVolunteering(
                userId,
                id
            );

        if (!alreadyVolunteering) {
            await addVolunteer(
                userId,
                id
            );

            req.flash(
                'success',
                `You are now volunteering for "${project.title}".`
            );
        } else {
            req.flash(
                'info',
                'You are already volunteering for this project.'
            );
        }

        res.redirect(`/projects/${id}`);
    } catch (error) {
        console.error(
            'Error adding volunteer:',
            error
        );

        req.flash(
            'error',
            'There was an error signing you up to volunteer.'
        );

        res.redirect(`/projects/${id}`);
    }
};

export const processRemoveVolunteer = async (
    req,
    res,
    next
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', 'Invalid project.');

        return res.redirect('/dashboard');
    }

    const { id } = req.params;

    const userId = req.session.user.user_id;

    const redirectTo =
        req.body.redirectTo === 'dashboard'
            ? '/dashboard'
            : `/projects/${id}`;

    try {
        await removeVolunteer(
            userId,
            id
        );

        req.flash(
            'success',
            'You have been removed as a volunteer for this project.'
        );

        res.redirect(redirectTo);
    } catch (error) {
        console.error(
            'Error removing volunteer:',
            error
        );

        req.flash(
            'error',
            'There was an error removing you as a volunteer.'
        );

        res.redirect(redirectTo);
    }
};