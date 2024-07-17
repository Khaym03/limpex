package main

import (
	"context"
	"fmt"

	"github.com/khaym03/limpex/internal/cart"
	"github.com/khaym03/limpex/internal/sales"
	"github.com/khaym03/limpex/internal/types"
)

// App struct
type App struct {
	ctx   context.Context
	Sales *sales.Sales
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{Sales: &sales.Sales{Cart: cart.NewCart()}}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	a.Sales.SetEvents(ctx)
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SalesObj() []types.OrderItem {
	return a.Sales.Cart.Items()
}
