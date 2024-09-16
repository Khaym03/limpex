package main

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/core/domain"
)

func main() {

	replicator := NewReplicator()
	defer replicator.Close()
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Post("/sync/products", replicator.Products)

	app.Listen(":3000")
}

type Replicator struct {
	psqlDB *sql.DB
}

func NewReplicator() *Replicator {
	return &Replicator{
		psqlDB: repository.NewPostgreSQLStorage(),
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

func (r *Replicator) Close() {
	r.psqlDB.Close()
}
