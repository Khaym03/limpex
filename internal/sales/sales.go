package sales

import (
	"context"
	"fmt"
	"sync"

	"github.com/khaym03/limpex/internal/common"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/ports"
	"github.com/khaym03/limpex/internal/core/services/cart"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	// Events
	updateCart = "update-cart"

	// Status
	StatusPending   = "pending"
	StatusCompleted = "completed"
)

var salesInstance *Sales
var once sync.Once

type Sales struct {
	Cart  *cart.Cart
	Store ports.ProductStore
	ctx   context.Context
}

func NewSales() *Sales {
	once.Do(func() {
		salesInstance = &Sales{Cart: cart.NewCart()}
	})

	return salesInstance
}

func NewOrderItem(id int64, productID int64, quantity float64, unitPrice float64, subtotal float64) *domain.OrderItem {
	return &domain.OrderItem{
		Id:        id,
		ProductID: productID,
		Quantity:  quantity,
		UnitPrice: unitPrice,
		Subtotal:  subtotal,
	}
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

	s.Cart.AddItem(&oip)

	runtime.EventsEmit(s.ctx, updateCart)
}

func (s *Sales) GetCartItems() []domain.OrderItemPayload {
	return s.Cart.Items()
}

func (s *Sales) RemoveItemFromCart(id int64) {
	s.Cart.RemoveItem(id)
	runtime.EventsEmit(s.ctx, updateCart)
}

func (s *Sales) ResetCart() {
	s.Cart.Reset()
	runtime.EventsEmit(s.ctx, updateCart)
}
