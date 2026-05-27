import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

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