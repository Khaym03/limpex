package repository

import (
	"database/sql"
	"log"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

var sqliteInstance *sql.DB
var sqliteOnce sync.Once

func NewSQLiteStorage() *sql.DB {

	sqliteOnce.Do(func() {
		dbConn, err := sql.Open("sqlite3", "./limpex.db")
		if err != nil {
			log.Fatal(err)
		}

		if err := dbConn.Ping(); err != nil {
			log.Fatal(err)
		}

		sqliteInstance = dbConn
	})

	return sqliteInstance
}
