// server.js

import express from "express"
import dotenv from "dotenv"
import path from "path"

import { fileURLToPath }
  from "url"

import { testConnection }
  from "./src/models/db.js"

import organizationRoutes
  from "./src/routes/organizationRoute.js"

import projectRoutes
  from "./src/routes/projectRoute.js"

import categoryRoutes
  from "./src/routes/categoryRoute.js"

dotenv.config()

const app = express()

const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)

const PORT =
  process.env.PORT || 3000

app.use(
  express.static(
    path.join(__dirname, "public")
  )
)

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.set("view engine", "ejs")

app.set(
  "views",
  path.join(__dirname, "src/views")
)

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home"
  })
})

app.use(
  "/organizations",
  organizationRoutes
)

app.use(
  "/projects",
  projectRoutes
)

app.use(
  "/categories",
  categoryRoutes
)

app.use((req, res) => {
  res.status(404).render(
    "errors/404",
    {
      title: "404"
    }
  )
})

app.use((err, req, res, next) => {
  console.error(err.stack)

  res.status(500).render(
    "errors/500",
    {
      title: "Server Error",
      error: err
    }
  )
})

app.listen(PORT, async () => {
  try {
    await testConnection()

    console.log(
      `Server running on port ${PORT}`
    )
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
})