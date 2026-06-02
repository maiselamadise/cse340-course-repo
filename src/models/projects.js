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
        WHERE p.start_date >= CURRENT_DATE
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
            p.location,
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

export const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        INSERT INTO projects (title, description, location, start_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

export const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        UPDATE projects
        SET title = $1, description = $2, location = $3, start_date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }

    return result.rows[0].project_id;
};