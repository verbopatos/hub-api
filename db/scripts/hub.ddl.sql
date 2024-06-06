-- DEPRECATED: using Prisma migrations.
-- This file is kept for reference only.
-- ddl.sql
CREATE TABLE "EventTypes" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE "Events" (
    id SERIAL PRIMARY KEY,
    event_type_id INT REFERENCES "EventTypes"(id),
    datetime TIMESTAMP NOT NULL
);

CREATE TABLE "Roles" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
