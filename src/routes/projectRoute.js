import express from "express"

const router = express.Router()

import {
  buildProjects,
  buildProjectDetails
} from "../controllers/projectController.js"

router.get("/", buildProjects)

router.get("/:id",
  buildProjectDetails
)

export default router