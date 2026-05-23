// src/controllers/projectController.js

import {
  getAllProjects,
  getProjectById
} from "../models/project-model.js"

import {
  getCategoriesByProjectId
} from "../models/category-model.js"

const buildProjects =
  async (req, res, next) => {
    try {
      const projects =
        await getAllProjects()

      res.render(
        "projects/index",
        {
          title: "Projects",
          projects
        }
      )
    } catch (error) {
      next(error)
    }
  }

const buildProjectDetails =
  async (req, res, next) => {
    try {
      const id = req.params.id

      const project =
        await getProjectById(id)

      if (!project) {
        return res
          .status(404)
          .render("errors/404", {
            title: "Project Not Found"
          })
      }

      const categories =
        await getCategoriesByProjectId(id)

      res.render(
        "projects/detail",
        {
          title: project.project_name,
          project,
          categories
        }
      )
    } catch (error) {
      next(error)
    }
  }

export {
  buildProjects,
  buildProjectDetails
}