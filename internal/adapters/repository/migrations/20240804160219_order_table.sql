-- +goose Up
CREATE TABLE
    IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        costumer_id INTEGER,
        created_at DATETIME DEFAULT (DATETIME('now','utc')),
        updated_at DATETIME DEFAULT (DATETIME('now','utc')),
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL,
        paid_at DATETIME,
        total_amount REAL NOT NULL,
        FOREIGN KEY (costumer_id) REFERENCES costumers (id) ON DELETE SET NULL
    );

-- +goose Down
DROP TABLE IF EXISTS orders;