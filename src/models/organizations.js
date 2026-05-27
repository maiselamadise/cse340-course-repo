import pool from './db.js';

export const getAllOrganizations = async () => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        ORDER BY name;
    `;

    const result = await pool.query(query);

    return result.rows;
};

export const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;

    const result = await pool.query(query, [organizationId]);

    return result.rows[0];
};

export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            title,
            description,
            start_date,
            end_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY start_date;
    `;

    const result = await pool.query(query, [organizationId]);

    return result.rows;
};