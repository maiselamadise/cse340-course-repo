import express from "express"

const router = express.Router()

import {
  buildOrganizations,
  buildOrganizationDetails
} from "../controllers/organizationController.js"

router.get("/", buildOrganizations)

router.get("/:id",
  buildOrganizationDetails
)

export default router