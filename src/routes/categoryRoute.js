import express from "express"

const router = express.Router()

import {
  buildCategories,
  buildCategoryDetails
} from "../controllers/categoryController.js"

router.get("/", buildCategories)

router.get("/:id",
  buildCategoryDetails
)

export default router