/**
 * seed.js — Admin Account Setup
 *
 * Ensures the required grader testing account exists with the correct password.
 * Safe to run multiple times — will reset the password if account already exists.
 *
 * Usage:
 *   node --env-file=.env src/seed.js
 */

import bcrypt from 'bcryptjs';
import db from './models/db.js';

const ADMIN_NAME     = 'Site Admin';
const ADMIN_EMAIL    = 'admin@example.com';
const ADMIN_PASSWORD = 'cse340!';

async function seed() {

    console.log('🌱 Running seed...\n');

    // 1. Hash the admin password with bcryptjs (same library the app uses)
    const salt         = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // 2. Ensure the roles table has the required roles
    await db.query(`
        INSERT INTO roles (role_name, role_description)
        VALUES
            ('user',  'Standard user with basic access'),
            ('admin', 'Administrator with full system access')
        ON CONFLICT (role_name) DO NOTHING
    `);

    // 3. Upsert admin account — creates it or resets the password if it exists
    const result = await db.query(`
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES (
            $1,
            $2,
            $3,
            (SELECT role_id FROM roles WHERE role_name = 'admin')
        )
        ON CONFLICT (email)
        DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            role_id       = EXCLUDED.role_id,
            name          = EXCLUDED.name
        RETURNING user_id, email
    `, [ADMIN_NAME, ADMIN_EMAIL, passwordHash]);

    console.log(`✅ Admin account ready:`);
    console.log(`   Email   : ${result.rows[0].email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   User ID : ${result.rows[0].user_id}`);
    console.log('\nSeed complete.');

    // Close the DB connection (works for both pool and wrapped dev db)
    if (typeof db.close === 'function') {
        await db.close();
    } else if (typeof db.end === 'function') {
        await db.end();
    }

    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
