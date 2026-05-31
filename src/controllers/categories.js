import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

import { getProjectById } from '../models/projects.js';

export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Categories',
            categories
        });
    } catch (err) {
        next(err);
    }
};

export const showCategoryDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await getCategoryById(id);

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(id);

        res.render('categoriesDetails', {
            title: category.category_name,
            category,
            projects
        });
    } catch (err) {
        next(err);
    }
};

export const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectById(projectId);

        if (!projectDetails) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (err) {
        next(err);
    }
};

export const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = (Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds])
            .filter((id) => id !== '' && id != null);

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');

        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};