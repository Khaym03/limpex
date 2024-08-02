package cart

import (
	"github.com/khaym03/limpex/internal/core/domain"
)

type Cart struct {
	items []domain.OrderItemPayload
}

func NewCart() *Cart {
	return &Cart{items: []domain.OrderItemPayload{}}
}

func (c *Cart) Items() []domain.OrderItemPayload {
	return c.items
}

func (c *Cart) AddItem(o *domain.OrderItemPayload) {

	for i, item := range c.items {
		if item.ProductID == o.ProductID {
			c.items[i].Quantity += o.Quantity
			c.items[i].Subtotal += o.Subtotal
			return
		}
	}

	c.items = append(c.items, *o)
}

func (c *Cart) RemoveItem(id int64) {
	if len(c.items) <= 0 {
		return
	}

	var newItems []domain.OrderItemPayload
	for _, item := range c.items {
		if item.ProductID != id {
			newItems = append(newItems, item)
		}
	}
	c.items = newItems
}

func (c *Cart) Reset() {
	c.items = []domain.OrderItemPayload{}
}
