-- +goose Up
CREATE TABLE dollar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    price REAL DEFAULT 0 
);

-- +goose Down
DROP TABLE IF EXISTS dollar;
