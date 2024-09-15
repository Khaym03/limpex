package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/services/product"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":3000")

	replicator := NewReplicator()
	defer replicator.Close()

	// replicator.q()

	// replicator.q()
}

type Replicator struct {
	sqliteDB *sql.DB
	psqlDB   *sql.DB
}

func NewReplicator() *Replicator {
	return &Replicator{
		sqliteDB: repository.NewSQLiteStorage(),
		psqlDB:   repository.NewPostgreSQLStorage(),
	}
}

func (r *Replicator) Products() {
	query := "INSERT INTO products(name, purchase_price, sale_price) VALUES ($1, $2, $3)"

	// Cambia la conexión a la base de datos a una transacción
	// tx, err := r.psqlDB.Begin()
	// if err != nil {
	// 	log.Fatalf("Error starting transaction: %v", err)
	// }

	prodSrv := product.NewService(r.sqliteDB)

	products := prodSrv.GetCleaningProducts()
	p := products[0]

	// for _, p := range products {
	// 	fmt.Println(p.Name)
	_, err := r.psqlDB.Exec(query, "dse", 2, 4)
	if err != nil {
		log.Printf("Error inserting product %s: %v", p.Name, err)
	}

	fmt.Println("All good...")

}

func (r *Replicator) Q() {
	var i domain.Product

	result := r.psqlDB.QueryRow("SELECT * FROM products WHERE id = 1")
	result.Scan(&i.Id, &i.Name, &i.PurchasePrice, &i.SalePrice)
	fmt.Println(i)
}

func (r *Replicator) Close() {
	r.sqliteDB.Close()
	r.psqlDB.Close()
}
