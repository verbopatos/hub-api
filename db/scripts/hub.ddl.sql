-- ddl.sql
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_type_id INT REFERENCES event_types(id),
    datetime TIMESTAMP NOT NULL
);
