import pool from './db.js';

export const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM categories
        ORDER BY category_name;
    `;

    const result = await pool.query(query);

    return result.rows;
};

export const getCategoryById = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await pool.query(query, [categoryId]);

    return result.rows[0];
};

export const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.category_name
        FROM categories c
        INNER JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await pool.query(query, [projectId]);

    return result.rows;
};

export const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.start_date,
            p.end_date,
            o.organization_id,
            o.name AS organization_name
        FROM projects p
        INNER JOIN project_categories pc
            ON p.project_id = pc.project_id
        INNER JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.start_date;
    `;

    const result = await pool.query(query, [categoryId]);

    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_categories (project_id, category_id)
        VALUES ($1, $2);
    `;

    await pool.query(query, [projectId, categoryId]);
};

export const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO categories (category_name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await pool.query(query, [categoryName]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

export const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE categories
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await pool.query(query, [categoryName, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};

export const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;

    await pool.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};