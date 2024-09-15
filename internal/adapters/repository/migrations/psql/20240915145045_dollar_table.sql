-- +goose Up

CREATE TABLE IF NOT EXISTS dollar (
    id SERIAL PRIMARY KEY,
    price NUMERIC DEFAULT 0
);

-- +goose Down

DROP TABLE IF EXISTS dollar;