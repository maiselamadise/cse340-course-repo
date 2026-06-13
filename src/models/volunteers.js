import pool from './db.js';
export const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;

    await pool.query(query, [userId, projectId]);
};

export const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;

    await pool.query(query, [userId, projectId]);
};

export const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;

    const result = await pool.query(query, [userId, projectId]);

    return result.rows.length > 0;
};

export const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.start_date,
            p.end_date,
            o.organization_id,
            o.name AS organization_name
        FROM project_volunteers pv
        INNER JOIN projects p
            ON pv.project_id = p.project_id
        INNER JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.start_date;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};
