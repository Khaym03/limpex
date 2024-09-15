package repository

import (
	"database/sql"
	"log"
	"os"
	"sync"

	_ "github.com/lib/pq" // PostgreSQL driver
)

var psqlInstance *sql.DB
var psqlOnce sync.Once

func NewPostgreSQLStorage() *sql.DB {

	psqlOnce.Do(func() {
		connStr := os.Getenv("POSTGRES_URL")

		dbConn, err := sql.Open("postgres", connStr)
		if err != nil {
			log.Fatal(err)
		}

		if err := dbConn.Ping(); err != nil {
			log.Fatal(err)
		}

		psqlInstance = dbConn
	})

	return psqlInstance
}
