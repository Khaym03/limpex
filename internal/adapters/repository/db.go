package repository

import (
	"database/sql"
	"log"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB
var once sync.Once

func NewSQLiteStorage() *sql.DB {

	once.Do(func() {
		dbConn, err := sql.Open("sqlite3", "./limpex.db")
		if err != nil {
			log.Fatal(err)
		}

		if err := dbConn.Ping(); err != nil {
			log.Fatal(err)
		}

		db = dbConn
	})

	return db
}
