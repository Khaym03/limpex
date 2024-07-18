package main

import (
	"context"
	"fmt"
	"log"

	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/cart"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/ports"
	"github.com/khaym03/limpex/internal/core/services/product"
	"github.com/khaym03/limpex/internal/sales"
)

// App struct
type App struct {
	ctx            context.Context
	Sales          *sales.Sales
	ProductService ports.ProductStore
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{Sales: &sales.Sales{Cart: cart.NewCart()}}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	dbConn, err := repository.NewSQLiteStorage()
	if err != nil {
		log.Fatal(err)
	}
	if err := dbConn.Ping(); err != nil {
		log.Fatal(err)
	}

	a.ProductService = product.NewService(dbConn)

	a.Sales.SetEvents(ctx)
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SalesObj() []domain.OrderItem {
	return a.Sales.Cart.Items()
}

func (a *App) CreateCleaningProduct(name string, price float64, color string) {
	if err := a.ProductService.CreateCleaningProduct(name, price, color); err != nil {
		fmt.Println(err)
	}
}

func (a *App) GetCleaningProducts() []domain.CleaningProduct {
	return a.ProductService.GetCleaningProducts()
}
