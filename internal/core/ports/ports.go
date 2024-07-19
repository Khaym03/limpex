package ports

import "github.com/khaym03/limpex/internal/core/domain"

type ProductStore interface {
	CreateProduct(name string, price float64) (int64, error)
	CreateCleaningProduct(name string, price float64, color string) error
	GetCleaningProducts() []domain.CleaningProduct
	DeleteById(id int64) error
	GetById(id int64) (*domain.CleaningProduct, error)
	UpdateCleaningProduct(id int64, name string, price float64, color string) error
}
