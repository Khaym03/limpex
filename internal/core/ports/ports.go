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

type CustomerStore interface {
	CreateCustomer(domain.CustomerPayload) error
	GetCustomers() []domain.Customer
	GetCustomerById(id int64) (*domain.Customer, error)
	Delete(id int64) error
}

type OrderStore interface {
	SaveOrder(*domain.OrderPayload) error
	GetOrderById(id int64) (*domain.Order, error)
	ListOrders() ([]domain.Order, error)
	ListOrdersByDate(date time.Time, clientTimeZone string) ([]domain.Order, error)
	ListOrdersByDateRange(startDate, endDate time.Time, clientTimeZone string) ([]domain.Order, error)
	ListOrdersByStatus(status string) ([]domain.Order, error)
	DeleteOrder(id int64) error
	MarkAsPaid(orderId int64, paymentMethod string) error
	MakeAPartialPayment(orderId int64, amount float64, paymentMethod string) error
	GetTotalPayments(orderId int64) (float64, error)
	OrdersSummaryByDate(startDate, endDate time.Time, clientTimeZone string) ([]domain.Order, error)
	GetOrdersByCustomerAndStatus(id int64, status string) ([]domain.Order, error)
	OrdersMadeInAMonth(date time.Time) ([]domain.Order, error)
}

type ShoppingCart interface {
	AddItem(o *domain.OrderItemPayload)
	RemoveItem(id int64)
	Items() []domain.OrderItemPayload
	Clear()
	SaveItems(orderId int64) error
	CalcTotal() float64
}
