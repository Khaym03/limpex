package sales

import (
	"context"
	"fmt"

	"github.com/khaym03/limpex/internal/cart"
	"github.com/khaym03/limpex/internal/types"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	// Events
	AddToCart      = "add-to-cart"
	RemoveFromCart = "remove-from-cart"

	// Status
	StatusPending   = "pending"
	StatusCompleted = "completed"
)

func NewOrderItem(id types.Id, quantity float64, totalPrice float64) *types.OrderItem {
	return &types.OrderItem{
		Id:         id,
		Quantity:   quantity,
		TotalPrice: totalPrice,
	}
}

type Sales struct {
	Cart *cart.Cart
}

func (s *Sales) SetEvents(ctx context.Context) {
	runtime.EventsOn(ctx, AddToCart, func(optionalData ...interface{}) {
		orderItem, err := NewOrderItemFromJS(optionalData[0].(map[string]interface{}))
		if err != nil {
			fmt.Println(err)
		}

		fmt.Println(s.Cart.Items())

		s.Cart.AddItem(orderItem)

		runtime.EventsEmit(ctx, "eco", s.Cart.Items())
	})

	runtime.EventsOn(ctx, RemoveFromCart, func(optionalData ...interface{}) {
		data := optionalData[0].(map[string]any)

		id, err := ExtractId(data)
		if err != nil {
			fmt.Println(err)
		}

		s.Cart.RemoveItem(id)

		fmt.Println(s.Cart.Items())
	})
}

func NewOrderItemFromJS(m map[string]interface{}) (*types.OrderItem, error) {
	var orderItem types.OrderItem

	idVal, ok := m["Id"]
	if !ok {
		return nil, fmt.Errorf("missing 'id' field in input map")
	}
	id, ok := idVal.(float64)
	if !ok {
		return nil, fmt.Errorf("'id' field is not a number")
	}
	orderItem.Id = uint64(id)

	quantityVal, ok := m["Quantity"]
	if !ok {
		return nil, fmt.Errorf("missing 'quantity' field in input map")
	}
	quantity, ok := quantityVal.(float64)
	if !ok {
		return nil, fmt.Errorf("'quantity' field is not a number")
	}
	orderItem.Quantity = quantity

	totalPriceVal, ok := m["TotalPrice"]
	if !ok {
		return nil, fmt.Errorf("missing 'totalPrice' field in input map")
	}
	totalPrice, ok := totalPriceVal.(float64)
	if !ok {
		return nil, fmt.Errorf("'totalPrice' field is not a number")
	}
	orderItem.TotalPrice = totalPrice

	return &orderItem, nil
}

func ExtractId(m map[string]interface{}) (types.Id, error) {
	idVal, ok := m["Id"]
	if !ok {
		return 0, fmt.Errorf("missing 'id' field in input map")
	}
	id, ok := idVal.(float64)
	if !ok {
		return 0, fmt.Errorf("'id' field is not a number")
	}

	return uint64(id), nil
}