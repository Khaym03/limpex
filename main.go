package main

import (
	"embed"
	"fmt"

	"github.com/khaym03/limpex/internal/currency"
	"github.com/khaym03/limpex/internal/metrics"
	"github.com/khaym03/limpex/internal/sales"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

type X struct{}

func (x X) Hi() {
	fmt.Println("hi")
}

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	salesHandler := sales.NewSales()
	metricsHandler := metrics.Handler()
	currencyHandler := currency.Handler()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "limpex",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			salesHandler,
			metricsHandler,
			currencyHandler,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
