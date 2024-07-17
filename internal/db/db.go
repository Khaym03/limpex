package db

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

func NewSQLiteStorage() (*sql.DB, error) {
	workDir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	dbPath := filepath.Join(workDir, "/internal/db/db.db")

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}

	return db, nil
}
