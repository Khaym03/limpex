-- +goose Up
CREATE TABLE order_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    amount REAL NOT NULL,
    created_at DATETIME DEFAULT (DATETIME('now','utc')),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE IF EXISTS order_payments;
