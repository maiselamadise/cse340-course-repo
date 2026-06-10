import bcrypt from 'bcrypt';
import db from './db.js';

const createUser = async (name, email, passwordHash) => {

    const default_role = 'user';

    const query = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES (
            $1,
            $2,
            $3,
            (SELECT role_id
             FROM roles
             WHERE role_name = $4)
        )
        RETURNING user_id
    `;

    const queryParams = [
        name,
        email,
        passwordHash,
        default_role
    ];

    const result = await db.query(
        query,
        queryParams
    );

    if (result.rows.length === 0) {
        throw new Error(
            'Failed to create user'
        );
    }

    return result.rows[0].user_id;
};

/* =========================
   FIND USER BY EMAIL
========================= */

const findUserByEmail = async (email) => {

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name AS role
        FROM users u
        LEFT JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1
    `;

    const result = await db.query(
        query,
        [email]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/* =========================
   GET ALL USERS
========================= */

const getAllUsers = async () => {

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name AS role
        FROM users u
        LEFT JOIN roles r
            ON u.role_id = r.role_id
        ORDER BY u.name
    `;

    const result = await db.query(query);

    return result.rows;
};

/* =========================
   VERIFY PASSWORD
========================= */

const verifyPassword = async (
    password,
    passwordHash
) => {

    return bcrypt.compare(
        password,
        passwordHash
    );
};

/* =========================
   AUTHENTICATE USER
========================= */

const authenticateUser = async (
    email,
    password
) => {

    const user = await findUserByEmail(
        email
    );

    if (!user) {
        return null;
    }

    const passwordMatches =
        await verifyPassword(
            password,
            user.password_hash
        );

    if (!passwordMatches) {
        return null;
    }

    delete user.password_hash;

    return user;
};

/* =========================
   EXPORTS
========================= */

export {
    createUser,
    authenticateUser,
    getAllUsers
};