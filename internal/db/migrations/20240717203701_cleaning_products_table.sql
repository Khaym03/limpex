-- +goose Up
CREATE TABLE IF NOT EXISTS cleaning_products (
    product_id INTEGER PRIMARY KEY REFERENCES Products(id) ON DELETE CASCADE,
    color TEXT NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS cleaning_products;
