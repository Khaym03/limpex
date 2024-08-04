-- +goose Up
CREATE TABLE
    IF NOT EXISTS costumers (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        createdAt TIMESTAMP NOT NULL,
        ci TEXT
    );

-- +goose Down
DROP TABLE IF EXISTS costumers;