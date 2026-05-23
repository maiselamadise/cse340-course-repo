// src/controllers/categoryController.js

import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId
} from "../models/category-model.js"

const buildCategories =
  async (req, res, next) => {
    try {
      const categories =
        await getAllCategories()

      res.render(
        "categories/index",
        {
          title: "Categories",
          categories
        }
      )
    } catch (error) {
      next(error)
    }
  }

const buildCategoryDetails =
  async (req, res, next) => {
    try {
      const id = req.params.id

      const category =
        await getCategoryById(id)

      if (!category) {
        return res
          .status(404)
          .render("errors/404", {
            title: "Category Not Found"
          })
      }

      const projects =
        await getProjectsByCategoryId(id)

      res.render(
        "categories/detail",
        {
          title: category.category_name,
          category,
          projects
        }
      )
    } catch (error) {
      next(error)
    }
  }

export {
  buildCategories,
  buildCategoryDetails
}