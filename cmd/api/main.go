package main

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/ports"
	"github.com/khaym03/limpex/internal/core/services/product"
)

func main() {

	replicator := NewReplicator()
	defer replicator.Close()
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Post("/sync/products", replicator.Products)
	app.Get("/products", func(c *fiber.Ctx) error {
		return c.JSON(replicator.productSvc.GetCleaningProducts())
	})

	app.Listen(":3000")
}

type Replicator struct {
	sqliteDB   *sql.DB
	psqlDB     *sql.DB
	productSvc ports.ProductStore
}

func NewReplicator() *Replicator {
	sqliteConn := repository.NewSQLiteStorage()
	return &Replicator{
		sqliteDB:   sqliteConn,
		psqlDB:     repository.NewPostgreSQLStorage(),
		productSvc: product.NewService(sqliteConn),
	}
}

func (r *Replicator) Products(c *fiber.Ctx) error {
	query := "INSERT INTO products(name, purchase_price, sale_price) VALUES ($1, $2, $3)"

	var products []domain.Product

	err := c.BodyParser(&products)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("error parsing the req")
	}

	for _, p := range products {
		fmt.Println(p.Name)
		_, err = r.psqlDB.Exec(query, p.Name, p.PurchasePrice, p.SalePrice)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(
				fmt.Sprintf("Error inserting product %s: %v", p.Name, err))
		}
	}

	return c.Status(fiber.StatusOK).SendString("All good...")

}

// func (r *Replicator) Q() {
// 	var i domain.Product

// 	result := r.psqlDB.QueryRow("SELECT * FROM products WHERE id = 1")
// 	result.Scan(&i.Id, &i.Name, &i.PurchasePrice, &i.SalePrice)
// 	fmt.Println(i)
// }

func (r *Replicator) Close() {
	r.sqliteDB.Close()
	r.psqlDB.Close()
}
