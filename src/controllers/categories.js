import { body, param, validationResult } from 'express-validator';

import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectById } from '../models/projects.js';

const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Category name must be between 1 and 100 characters')
];

const categoryIdValidation = [
    param('id')
        .isInt().withMessage('Invalid category ID')
];

const assignCategoriesValidation = [
    param('projectId')
        .isInt().withMessage('Invalid project ID'),
    body('categoryIds')
        .optional()
        .custom((value) => {
            const ids = Array.isArray(value) ? value : [value];

            return ids.every((id) => id === '' || Number.isInteger(Number(id)));
        })
        .withMessage('Category IDs must be valid integers')
];

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

export const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

export const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    try {
        const { categoryName } = req.body;
        const categoryId = await createCategory(categoryName);

        req.flash('success', 'Category added successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (err) {
        if (err.code === '23505') {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect('/new-category');
        }

        next(err);
    }
};

export const showEditCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/categories');
    }

    try {
        const { id } = req.params;
        const category = await getCategoryById(id);

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const title = 'Edit Category';

        res.render('edit-category', { title, category });
    } catch (err) {
        next(err);
    }
};

export const processEditCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${req.params.id}`);
    }

    try {
        const { id } = req.params;
        const { categoryName } = req.body;

        await updateCategory(id, categoryName);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${id}`);
    } catch (err) {
        if (err.code === '23505') {
            req.flash('error', 'A category with that name already exists.');
            return res.redirect(`/edit-category/${req.params.id}`);
        }

        next(err);
    }
};

export const showAssignCategoriesForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/projects');
    }

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/assign-categories/${req.params.projectId}`);
    }

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

export {
    categoryValidation,
    categoryIdValidation,
    assignCategoriesValidation
};
