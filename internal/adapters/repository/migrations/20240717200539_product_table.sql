-- +goose Up
CREATE TABLE IF NOT EXISTS products (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    purchase_price REAL NOT NULL,  
    sale_price REAL NOT NULL       
);

-- +goose Down
DROP TABLE IF EXISTS products;
