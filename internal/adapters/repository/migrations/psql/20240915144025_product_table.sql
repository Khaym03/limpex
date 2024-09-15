-- +goose Up

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    purchase_price NUMERIC NOT NULL,
    sale_price NUMERIC NOT NULL
);

-- +goose Down

DROP TABLE IF EXISTS products;