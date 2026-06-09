import express from 'express'
import session from 'express-session'
import { fileURLToPath } from 'url'
import path from 'path'

import { testConnection } from './src/models/db.js'
import router from './src/routes.js'
import flash from './src/middleware/flash.js'

/* =========================
   CONFIG
========================= */

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase() ||
    'development'

const PORT =
    process.env.PORT || 3000

const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    'local-development-secret'

const __filename =
    fileURLToPath(import.meta.url)

const __dirname =
    path.dirname(__filename)

const app = express()

/* =========================
   BODY PARSER
========================= */

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

/* =========================
   SESSION
========================= */

app.use(
    session({
        secret: SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 60 * 60 * 1000,

            secure:
                NODE_ENV === 'production'
        }
    })
)

/* =========================
   FLASH MESSAGES
========================= */

app.use(flash)

/* =========================
   STATIC FILES
========================= */

app.use(
    express.static(
        path.join(__dirname, 'public')
    )
)

/* =========================
   VIEW ENGINE
========================= */

app.set('view engine', 'ejs')

app.set(
    'views',
    path.join(__dirname, 'src/views')
)

/* =========================
   GLOBAL LOCALS
========================= */

app.use((req, res, next) => {

    // Current user
    res.locals.user =
        req.session.user || null

    // Login state
    res.locals.isLoggedIn =
        !!req.session.user

    // Admin state
    res.locals.isAdmin =
        req.session.user?.role === 'admin' ||
        req.session.user?.role === 1

    // Environment
    res.locals.NODE_ENV =
        NODE_ENV

    next()
})

/* =========================
   REQUEST LOGGER
========================= */

app.use((req, res, next) => {

    if (NODE_ENV === 'development') {

        console.log(
            `${req.method} ${req.url}`
        )
    }

    next()
})

/* =========================
   ROUTES
========================= */

app.use(router)

/* =========================
   FAVICON
========================= */

app.get('/favicon.ico', (req, res) => {

    res.status(204).end()
})

/* =========================
   404 HANDLER
========================= */

app.use((req, res, next) => {

    const err = new Error(
        'Page Not Found'
    )

    err.status = 404

    next(err)
})

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {

    console.error(
        'Error occurred:',
        err.message
    )

    if (NODE_ENV === 'development') {

        console.error(err.stack)
    }

    const status =
        err.status || 500

    const template =
        status === 404
            ? 'errors/404'
            : 'errors/500'

    res.status(status).render(
        template,
        {
            title:
                status === 404
                    ? 'Page Not Found'
                    : 'Server Error',

            error: err.message,

            stack:
                NODE_ENV === 'development'
                    ? err.stack
                    : null
        }
    )
})

/* =========================
   START SERVER
========================= */

const server = app.listen(
    PORT,
    async () => {

        try {

            await testConnection()

            console.log(
                `Server is running at http://127.0.0.1:${PORT}`
            )

            console.log(
                `Environment: ${NODE_ENV}`
            )

        } catch (error) {

            console.error(
                'Error connecting to database:',
                error
            )
        }
    }
)

/* =========================
   SERVER ERRORS
========================= */

server.on('error', (error) => {

    if (error.code === 'EADDRINUSE') {

        console.error(
            `Port ${PORT} is already in use`
        )

        process.exit(1)
    }

    throw error
})