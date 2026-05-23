// src/controllers/organizationController.js

import {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId
} from "../models/organization-model.js"

const buildOrganizations =
  async (req, res, next) => {
    try {
      const organizations =
        await getAllOrganizations()

      res.render(
        "organizations/index",
        {
          title: "Organizations",
          organizations
        }
      )
    } catch (error) {
      next(error)
    }
  }

const buildOrganizationDetails =
  async (req, res, next) => {
    try {
      const id = req.params.id

      const organization =
        await getOrganizationById(id)

      if (!organization) {
        return res
          .status(404)
          .render("errors/404", {
            title: "Organization Not Found"
          })
      }

      const projects =
        await getProjectsByOrganizationId(id)

      res.render(
        "organizations/detail",
        {
          title: organization.name,
          organization,
          projects
        }
      )
    } catch (error) {
      next(error)
    }
  }

export {
  buildOrganizations,
  buildOrganizationDetails
}