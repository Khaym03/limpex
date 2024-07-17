package cart

import (
	"github.com/khaym03/limpex/internal/types"
)

type Cart struct {
	items []types.OrderItem
}

func NewCart() *Cart {
	return &Cart{items: []types.OrderItem{}}
}

func (c *Cart) Items() []types.OrderItem {
	return c.items
}

func (c *Cart) AddItem(o *types.OrderItem) {
	c.items = append(c.items, *o)
}

func (c *Cart) RemoveItem(id types.Id) {
	if len(c.items) <= 0 {
		return
	}

	var newItems []types.OrderItem
	for _, item := range c.items {
		if item.Id != id {
			newItems = append(newItems, item)
		}
	}
	c.items = newItems
}

func (c *Cart) Reset() {
	c.items = []types.OrderItem{}
}
