package ports

import "github.com/khaym03/limpex/internal/core/domain"

type ProductStore interface {
	CreateProduct(name string, price float64) (int64, error)
	CreateCleaningProduct(name string, price float64, color string) error
	GetCleaningProducts() []domain.CleaningProduct
}
