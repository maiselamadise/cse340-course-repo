-- Drop tables if they already exist
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organization;

-- =========================
-- ORGANIZATION TABLE
-- =========================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(150) NOT NULL UNIQUE,
    logo_filename VARCHAR(255)
);

-- =========================
-- PROJECTS TABLE
-- =========================
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

-- =========================
-- CATEGORIES TABLE
-- =========================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================
-- PROJECT CATEGORIES
-- JUNCTION TABLE
-- =========================
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

-- =========================
-- INSERT ORGANIZATIONS
-- =========================
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

-- =========================
-- INSERT PROJECTS
-- =========================
INSERT INTO projects (
    organization_id,
    title,
    description,
    start_date,
    end_date
)
VALUES
(
    1,
    'Community Housing Initiative',
    'Building affordable and sustainable homes for underserved families.',
    '2026-01-10',
    '2026-08-30'
),
(
    2,
    'Urban Garden Expansion',
    'Creating additional community gardens in urban neighborhoods.',
    '2026-02-15',
    '2026-09-15'
),
(
    3,
    'Volunteer Literacy Program',
    'Providing reading and tutoring support for local schools.',
    '2026-03-01',
    '2026-11-20'
);

-- =========================
-- INSERT CATEGORIES
-- =========================
INSERT INTO categories (category_name)
VALUES
('Community Service'),
('Environmental Sustainability'),
('Education Support');

-- =========================
-- INSERT PROJECT-CATEGORY
-- RELATIONSHIPS
-- =========================
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

-- =========================
-- SAMPLE QUERY
-- =========================
SELECT
    projects.project_id,
    projects.title,
    organization.name AS organization_name,
    categories.category_name
FROM projects
JOIN organization
    ON projects.organization_id = organization.organization_id
JOIN project_categories
    ON projects.project_id = project_categories.project_id
JOIN categories
    ON project_categories.category_id = categories.category_id
ORDER BY projects.project_id;

SELECT *
FROM projects;
