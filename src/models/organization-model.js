import db from "./db.js"

const getAllOrganizations =
  async () => {
    const query = `
      SELECT *
      FROM organization
      ORDER BY name;
    `

    const result =
      await db.query(query)

    return result.rows
  }

const getOrganizationById =
  async (id) => {
    const query = `
      SELECT *
      FROM organization
      WHERE organization_id = $1;
    `

    const result =
      await db.query(query, [id])

    return result.rows[0]
  }

const getProjectsByOrganizationId =
  async (id) => {
    const query = `
      SELECT *
      FROM projects
      WHERE organization_id = $1
      ORDER BY start_date;
    `

    const result =
      await db.query(query, [id])

    return result.rows
  }

export {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId
}