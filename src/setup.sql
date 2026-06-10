-- ==========================================
-- DROP TABLES (IN REVERSE DEPENDENCY ORDER)
-- ==========================================
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organization;

-- ==========================================
-- ORGANIZATION TABLE
-- ==========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(150) NOT NULL UNIQUE,
    logo_filename VARCHAR(255)
);

-- ==========================================
-- PROJECTS TABLE
-- ==========================================
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ==========================================
-- CATEGORIES TABLE
-- ==========================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ==========================================
-- PROJECT CATEGORIES (JUNCTION TABLE)
-- ==========================================
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- ==========================================
-- ROLES TABLE
-- ==========================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INSERT ORGANIZATIONS
-- ==========================================
INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ==========================================
-- INSERT PROJECTS
-- ==========================================
INSERT INTO projects (
    organization_id,
    title,
    description,
    location,
    start_date,
    end_date
)
VALUES
(
    1,
    'Community Housing Initiative',
    'Building affordable and sustainable homes for underserved families.',
    'Johannesburg',
    '2026-01-10',
    '2026-08-30'
),
(
    2,
    'Urban Garden Expansion',
    'Creating additional community gardens in urban neighborhoods.',
    'Cape Town',
    '2026-02-15',
    '2026-09-15'
),
(
    3,
    'Volunteer Literacy Program',
    'Providing reading and tutoring support for local schools.',
    'Durban',
    '2026-03-01',
    '2026-11-20'
);

-- ==========================================
-- INSERT CATEGORIES
-- ==========================================
INSERT INTO categories (category_name)
VALUES
('Community Service'),
('Environmental Sustainability'),
('Education Support');

-- ==========================================
-- INSERT PROJECT-CATEGORY RELATIONSHIPS
-- ==========================================
INSERT INTO project_categories (
    project_id,
    category_id
)
VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 1),
(3, 3);

-- ==========================================
-- INSERT ROLES
-- ==========================================
INSERT INTO roles (
    role_name,
    role_description
)
VALUES
(
    'user',
    'Standard user with basic access'
),
(
    'admin',
    'Administrator with full system access'
);

-- ==========================================
-- INSERT TEST USERS
-- ==========================================
-- Passwords (bcrypt hashed):
--   test@example.com  -> User123!   (role: user)
--   admin@example.com -> Admin123!  (role: admin)
INSERT INTO users (
    name,
    email,
    password_hash,
    role_id
)
VALUES
(
    'Test User',
    'test@example.com',
    '$2b$10$5jFm042K8s1P6CJvHYqBW.cidWBrJp7/U.ZW5oeY0RUfvBBEDgtga',
    (SELECT role_id FROM roles WHERE role_name = 'user')
),
(
    'Site Admin',
    'admin@example.com',
    '$2b$10$bup/Fz1yTkbD2m68CJc2G.DQHs.CGDywixU3dUXF8DzJQgXjllw3W',
    (SELECT role_id FROM roles WHERE role_name = 'admin')
);

-- ==========================================
-- VERIFY USERS AND ROLES
-- ==========================================
SELECT
    u.user_id,
    u.name,
    u.email,
    r.role_name,
    r.role_description
FROM users u
JOIN roles r
    ON u.role_id = r.role_id;

-- ==========================================
-- VERIFY PROJECTS
-- ==========================================
SELECT
    p.project_id,
    p.title,
    o.name AS organization_name,
    c.category_name
FROM projects p
JOIN organization o
    ON p.organization_id = o.organization_id
JOIN project_categories pc
    ON p.project_id = pc.project_id
JOIN categories c
    ON pc.category_id = c.category_id
ORDER BY p.project_id;