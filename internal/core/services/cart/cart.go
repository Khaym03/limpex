package cart

import (
	"github.com/khaym03/limpex/internal/core/domain"
)

type Cart struct {
	items []domain.OrderItem
}

func NewCart() *Cart {
	return &Cart{items: []domain.OrderItem{}}
}

func (c *Cart) Items() []domain.OrderItem {
	return c.items
}

func (c *Cart) AddItem(o *domain.OrderItem) {
	c.items = append(c.items, *o)
}

func (c *Cart) RemoveItem(id domain.Id) {
	if len(c.items) <= 0 {
		return
	}

	var newItems []domain.OrderItem
	for _, item := range c.items {
		if item.Id != id {
			newItems = append(newItems, item)
		}
	}
	c.items = newItems
}

func (c *Cart) Reset() {
	c.items = []domain.OrderItem{}
}
