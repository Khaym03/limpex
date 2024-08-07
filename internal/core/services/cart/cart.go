package cart

import (
	"database/sql"
	"fmt"
	"sync"

	"github.com/khaym03/limpex/internal/core/domain"
)

var instance *service
var once sync.Once

type service struct {
	items []domain.OrderItemPayload
	db    *sql.DB
}

func Service(db *sql.DB) *service {
	once.Do(func() {
		instance = &service{
			items: []domain.OrderItemPayload{},
			db:    db,
		}
	})
	return instance
}

func (c *service) Items() []domain.OrderItemPayload {
	return c.items
}

func (c *service) AddItem(o *domain.OrderItemPayload) {

	for i, item := range c.items {
		if item.ProductID == o.ProductID {
			c.items[i].Quantity += o.Quantity
			c.items[i].Subtotal += o.Subtotal
			return
		}
	}

	c.items = append(c.items, *o)
}

func (c *service) RemoveItem(id int64) {
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

func (c *service) Clear() {
	c.items = []domain.OrderItemPayload{}
}

func (s *service) SaveItems(orderId int64) error {
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, item := range s.Items() {
		_, err := s.db.Exec(`
			INSERT INTO order_items(order_id, product_id, quantity, unit_price, subtotal)
			VALUES (?, ?, ?, ?, ?)
		`,
			orderId,
			item.ProductID,
			item.Quantity,
			item.UnitPrice,
			item.Subtotal,
		)

		if err != nil {
			return fmt.Errorf("failed to insert order item for order ID %d: %w", orderId, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction for order ID %d: %w", orderId, err)
	}

	s.Clear()

	return nil
}

func (s *service) CalcTotal() float64 {
	var total float64 = 0
	for _, item := range s.Items() {
		total += item.Subtotal
	}

	return total
}
