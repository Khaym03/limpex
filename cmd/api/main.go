package main

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/services/product"
)

func main() {

	replicator := NewReplicator()
	defer replicator.Close()
	app := fiber.New()
	app.Use(cors.New())
	app.Use(logger.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Get("/list/products", replicator.ListProducts)

	app.Post("/sync/products", replicator.SyncProducts)

	app.Listen(":3000")
}

type Replicator struct {
	psqlDB         *sql.DB
	productScanner product.ProductScanner
}

func NewReplicator() *Replicator {
	return &Replicator{
		psqlDB:         repository.NewPostgreSQLStorage(),
		productScanner: product.ProductScanner{},
	}
}

func (r *Replicator) SyncProducts(c *fiber.Ctx) error {
	var products []domain.Product
	if err := c.BodyParser(&products); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Error parsing request body",
		})
	}

	const query = "INSERT INTO products(name, purchase_price, sale_price) VALUES ($1, $2, $3)"

	for _, product := range products {
		if err := r.insertProduct(query, product); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": fmt.Sprintf("Error inserting product %s: %v", product.Name, err),
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Products synchronized successfully",
	})
}

func (r *Replicator) insertProduct(query string, p domain.Product) error {
	_, err := r.psqlDB.Exec(query, p.Name, p.PurchasePrice, p.SalePrice)
	return err
}

func (r *Replicator) ListProducts(c *fiber.Ctx) error {
	cleaningRows, err := r.psqlDB.Query(`
	SELECT id, name, purchase_price, sale_price
	FROM products`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	defer cleaningRows.Close()

	products, err := r.productScanner.ScanProducts(cleaningRows)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.JSON(products)
}

func (r *Replicator) Close() {
	r.psqlDB.Close()
}
