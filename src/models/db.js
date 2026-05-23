import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false
  }
})

let db = null

if (
  process.env.NODE_ENV === "development" &&
  process.env.ENABLE_SQL_LOGGING === "true"
) {
  db = {
    async query(text, params) {
      try {
        const start = Date.now()

        const result =
          await pool.query(text, params)

        const duration =
          Date.now() - start

        console.log("Executed Query:", {
          text:
            text.replace(/\s+/g, " ").trim(),
          duration: `${duration}ms`,
          rows: result.rowCount
        })

        return result
      } catch (error) {
        console.error(error.message)
        throw error
      }
    },

    async close() {
      await pool.end()
    }
  }
} else {
  db = pool
}

const testConnection = async () => {
  try {
    const result =
      await db.query(
        "SELECT NOW() as current_time"
      )

    console.log(
      "Database Connected:",
      result.rows[0].current_time
    )
  } catch (error) {
    console.error(error.message)
  }
}

export { db as default, testConnection }