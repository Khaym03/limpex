package main

import (
	"context"
	"fmt"

	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/common"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/ports"
	"github.com/khaym03/limpex/internal/core/services/product"
	"github.com/khaym03/limpex/internal/metrics"
	"github.com/khaym03/limpex/internal/sales"
)

// App struct
type App struct {
	ctx            context.Context
	ProductService ports.ProductStore
}

// NewApp creates a new App application struct
func NewApp() *App {
	dbConn := repository.NewSQLiteStorage()
	return &App{ProductService: product.NewService(dbConn)}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	salesHanler := sales.NewSales()
	salesHanler.Start(ctx)

	metricsHandler := metrics.Handler()
	metricsHandler.Start(ctx)

}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) CreateCleaningProduct(productPayload any) domain.Message {
	var pp domain.ProductPayload
	common.JSToStruc(productPayload, &pp)

	_, err := a.ProductService.CreateProduct(pp)

	return common.MakeMessage(err)
}

func (a *App) GetCleaningProducts() []domain.Product {
	return a.ProductService.GetCleaningProducts()
}

func (a *App) DeleteProductById(id int64) domain.Message {
	err := a.ProductService.DeleteById(id)

	return common.MakeMessage(err)
}

func (a *App) GetCleaningProductById(id int64) *domain.Product {
	cp, err := a.ProductService.GetById(id)
	if err != nil {
		fmt.Println(err)
	}

	return cp
}

func (a *App) UpdateCleaningProduct(product any) domain.Message {
	var p domain.Product

	common.JSToStruc(product, &p)

	err := a.ProductService.UpdateCleaningProduct(p)
	return common.MakeMessage(err)
}
