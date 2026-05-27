import {
    getUpcomingProjects,
    getProjectById
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

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