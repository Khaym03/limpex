package currency

import (
	"database/sql"
	"fmt"

	"github.com/khaym03/limpex/internal/adapters/repository"
)

type currency struct {
	dbConn *sql.DB
}

func Handler() *currency {
	return &currency{
		dbConn: repository.NewSQLiteStorage(),
	}
}

func (c *currency) Dollar() float64 {
	var d float64

	row := c.dbConn.QueryRow(`SELECT price FROM dollar`)

	err := row.Scan(&d)

	if err != nil {
		if err == sql.ErrNoRows {
			_, insertErr := c.dbConn.Exec(`INSERT INTO dollar(price) VALUES(?)`, 0)
			if insertErr != nil {
				fmt.Printf("Error al insertar en la tabla dollar: %v", insertErr)
			}
			d = 0 // default
		} else {
			fmt.Printf("Error al consultar la tabla dollar: %v", err)
		}
	}

	return d
}

func (c *currency) Update(newPrice float64) {
	_, err := c.dbConn.Exec(`UPDATE dollar SET price = ?`, newPrice)
	if err != nil {
		fmt.Println(err)
	}
}
