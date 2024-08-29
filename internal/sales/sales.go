package sales

import (
	"context"
	"fmt"
	"sync"

	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/common"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/ports"
	"github.com/khaym03/limpex/internal/core/services/cart"
	"github.com/khaym03/limpex/internal/core/services/customer"
	"github.com/khaym03/limpex/internal/core/services/order"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	// Events
	updateCart      = "update-cart"
	updateCostumers = "update-costumers"

	// Status
	StatusPending   = "pending"
	StatusCompleted = "completed"
)

var salesInstance *Sales
var once sync.Once

type Sales struct {
	ShoppingCart  ports.ShoppingCart
	CustomerStore ports.CustomerStore
	OrderStore    ports.OrderStore
	ctx           context.Context
}

func NewSales() *Sales {
	once.Do(func() {
		dbConn := repository.NewSQLiteStorage()

		customerSrv := customer.NewService(dbConn)
		orderSrv := order.Service(dbConn)

		salesInstance = &Sales{
			ShoppingCart:  cart.Service(dbConn),
			CustomerStore: customerSrv,
			OrderStore:    orderSrv,
		}
	})

	return salesInstance
}

func (s *Sales) Start(ctx context.Context) {
	s.ctx = ctx
}

func (s *Sales) AddItemToCart(orderItemPayload any) {
	var oip domain.OrderItemPayload

	common.JSToStruc(orderItemPayload, &oip)

	s.ShoppingCart.AddItem(&oip)

	runtime.EventsEmit(s.ctx, updateCart)
}

func (s *Sales) GetCartItems() []domain.OrderItemPayload {
	return s.ShoppingCart.Items()
}

func (s *Sales) RemoveItemFromCart(id int64) {
	s.ShoppingCart.RemoveItem(id)
	runtime.EventsEmit(s.ctx, updateCart)
}

func (s *Sales) ResetCart() {
	s.ShoppingCart.Clear()
	runtime.EventsEmit(s.ctx, updateCart)
}

func (s *Sales) CreateCustomer(customerPayload any) domain.Message {
	var cp domain.CustomerPayload

	common.JSToStruc(customerPayload, &cp)

	err := s.CustomerStore.CreateCustomer(cp)

	runtime.EventsEmit(s.ctx, updateCostumers)

	return common.MakeMessage(err)
}

func (s *Sales) GetCustomers() []domain.Customer {
	return s.CustomerStore.GetCustomers()
}

func (s *Sales) GetCustomerById(id int64) *domain.Customer {
	c, err := s.CustomerStore.GetCustomerById(id)
	if err != nil {
		fmt.Println(err)
	}

	return c
}

func (s *Sales) DeleteCustomer(id int64) domain.Message {
	err := s.CustomerStore.Delete(id)
	return common.MakeMessage(err)
}

func (s *Sales) SaveOrder(op domain.OrderPayload) domain.Message {
	err := s.OrderStore.SaveOrder(&op)

	runtime.EventsEmit(s.ctx, updateCart)
	return common.MakeMessage(err)
}

func (s *Sales) ListOrders() []domain.Order {
	orders, err := s.OrderStore.ListOrders()
	if err != nil {
		fmt.Println(err)
	}
	return orders
}

func (s *Sales) ListOrdersByDate(d domain.DateArg) []domain.Order {
	orders, err := s.OrderStore.ListOrdersByDate(d.Date, d.ClientTimeZone)
	if err != nil {
		fmt.Println(err)
	}
	return orders
}

func (s *Sales) ListOrdersByDateRange(fromDate domain.DateArg, toDate domain.DateArg) []domain.Order {
	orders, err := s.OrderStore.ListOrdersByDateRange(fromDate.Date, toDate.Date, fromDate.ClientTimeZone)
	if err != nil {
		fmt.Println(err)
	}
	return orders
}

func (s *Sales) ListOrdersByStatus(status string) []domain.Order {
	orders, err := s.OrderStore.ListOrdersByStatus(status)
	if err != nil {
		fmt.Println(err)
	}
	return orders
}

func (s *Sales) DeleteOrder(id int64) domain.Message {
	err := s.OrderStore.DeleteOrder(id)
	return common.MakeMessage(err)
}

func (s *Sales) MakeAPartialPayment(orderId int64, amount float64, paymentMethod string) domain.Message {
	err := s.OrderStore.MakeAPartialPayment(orderId, amount, paymentMethod)
	return common.MakeMessage(err)
}

func (s *Sales) GetTotalPayments(orderId int64) float64 {
	total, err := s.OrderStore.GetTotalPayments(orderId)
	if err != nil {
		fmt.Println(err)
	}

	return total
}

func (s *Sales) GetOrdersByCustomerAndStatus(id int64, status string) []domain.Order {
	orders, err := s.OrderStore.GetOrdersByCustomerAndStatus(id, status)
	if err != nil {
		fmt.Println(err)
	}

	return orders
}
