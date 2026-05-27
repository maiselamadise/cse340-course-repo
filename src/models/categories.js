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