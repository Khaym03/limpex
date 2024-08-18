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
	"github.com/khaym03/limpex/internal/core/services/costumer"
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
	CostumerStore ports.CostumerStore
	OrderStore    ports.OrderStore
	ctx           context.Context
}

func NewSales() *Sales {
	once.Do(func() {
		dbConn := repository.NewSQLiteStorage()

		costumerSrv := costumer.NewService(dbConn)
		orderSrv := order.Service(dbConn)

		salesInstance = &Sales{
			ShoppingCart:  cart.Service(dbConn),
			CostumerStore: costumerSrv,
			OrderStore:    orderSrv,
		}
	})

	return salesInstance
}

func (s *Sales) Start(ctx context.Context) {

	s.ctx = ctx

	// runtime.EventsOn(ctx, RemoveFromCart, func(optionalData ...interface{}) {
	// 	data := optionalData[0].(map[string]any)

	// 	id, err := ExtractId(data)
	// 	if err != nil {
	// 		fmt.Println(err)
	// 	}

	// 	s.Cart.RemoveItem(id)

	// 	fmt.Println(s.Cart.Items())
	// })
}

func (s *Sales) AddItemToCart(orderItemPayload any) {
	var oip domain.OrderItemPayload

	common.JSToStruc(orderItemPayload, &oip)

	fmt.Println(oip)

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

func (s *Sales) CreateCostumer(costumerPayload any) domain.Message {
	var cp domain.CostumerPayload

	common.JSToStruc(costumerPayload, &cp)

	err := s.CostumerStore.CreateCostumer(cp)

	runtime.EventsEmit(s.ctx, updateCostumers)

	return common.MakeMessage(err)
}

func (s *Sales) GetCostumers() []domain.Costumer {
	return s.CostumerStore.GetCostumers()
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
