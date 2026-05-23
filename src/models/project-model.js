// src/models/project-model.js

import db from "./db.js"

const getAllProjects =
  async () => {
    const query = `
      SELECT
        p.*,
        o.name AS organization_name
      FROM projects p
      JOIN organization o
        ON p.organization_id =
           o.organization_id
      ORDER BY start_date;
    `

    const result =
      await db.query(query)

    return result.rows
  }

const getProjectById =
  async (id) => {
    const query = `
      SELECT
        p.*,
        o.name AS organization_name,
        o.organization_id
      FROM projects p
      JOIN organization o
        ON p.organization_id =
           o.organization_id
      WHERE p.project_id = $1;
    `

    const result =
      await db.query(query, [id])

    return result.rows[0]
  }

export {
  getAllProjects,
  getProjectById
}