import pool from './db.js';

export const getUpcomingProjects = async () => {
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
        INNER JOIN organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.start_date
        LIMIT 5;
    `;

    const result = await pool.query(query);

    return result.rows;
};

export const getProjectById = async (projectId) => {
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
        INNER JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await pool.query(query, [projectId]);

    return result.rows[0];
};