package ports

import (
	"time"

	"github.com/khaym03/limpex/internal/core/domain"
)

type ProductStore interface {
	CreateProduct(domain.ProductPayload) (int64, error)
	GetCleaningProducts() []domain.Product
	DeleteById(id int64) error
	GetById(id int64) (*domain.Product, error)
	UpdateCleaningProduct(domain.Product) error
}

type CostumerStore interface {
	CreateCostumer(domain.CostumerPayload) error
	GetCostumers() []domain.Costumer
	GetCostumerById(id int64) (*domain.Costumer, error)
}

type OrderStore interface {
	SaveOrder(*domain.OrderPayload) error
	GetOrderById(id int64) (*domain.Order, error)
	ListOrders() ([]domain.Order, error)
	ListOrdersByDate(date time.Time, clientTimeZone string) ([]domain.Order, error)
	ListOrdersByDateRange(startDate, endDate time.Time, clientTimeZone string) ([]domain.Order, error)
	DeleteOrder(id int64) error
}

type ShoppingCart interface {
	AddItem(o *domain.OrderItemPayload)
	RemoveItem(id int64)
	Items() []domain.OrderItemPayload
	Clear()
	SaveItems(orderId int64) error
	CalcTotal() float64
}
