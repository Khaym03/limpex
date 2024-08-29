-- +goose Up
CREATE TABLE
    IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        created_at DATETIME DEFAULT (DATETIME('now','utc')),
        updated_at DATETIME DEFAULT (DATETIME('now','utc')),
        payment_method TEXT,
        status TEXT NOT NULL,
        paid_at DATETIME,
        total_amount REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES custumers (id) ON DELETE CASCADE
    );

-- +goose Down
DROP TABLE IF EXISTS orders;