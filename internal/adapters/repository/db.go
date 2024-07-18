package repository

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func NewSQLiteStorage() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "internal/adapters/repository/limpex.db")
	if err != nil {
		log.Fatal(err)
	}

	return db, nil
}
