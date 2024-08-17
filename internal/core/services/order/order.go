package order

import (
	"database/sql"
	"fmt"
	"sync"
	"time"

	"github.com/khaym03/limpex/internal/common"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/ports"
	"github.com/khaym03/limpex/internal/core/services/cart"
)

var instance *service
var once sync.Once

type service struct {
	db           *sql.DB
	shoppingCart ports.ShoppingCart
}

func Service(db *sql.DB) *service {
	once.Do(func() {
		instance = &service{
			db:           db,
			shoppingCart: cart.Service(db),
		}
	})
	return instance
}

func (s *service) SaveOrder(op *domain.OrderPayload) error {
	id, err := s.createOrder(op)
	if err != nil {
		return err
	}

	// Save the order but dont mark as paid
	if op.CostumerID != nil {
		return nil
	}

	err = s.MarkAsPaid(id)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) GetOrderById(id int64) (*domain.Order, error) {
	order, err := s.getOrderById(id)
	if err != nil {
		return nil, err
	}

	orderItems, err := s.GetOrderItemsByOrderId(id)
	if err != nil {
		return nil, err
	}

	order.Items = orderItems

	return order, nil
}

func (s *service) createOrder(op *domain.OrderPayload) (int64, error) {
	fmt.Println(op, s.shoppingCart.CalcTotal())
	result, err := s.db.Exec(`
		INSERT INTO orders(costumer_id, payment_method, status, total_amount)
		VALUES (?, ?, ?, ?)
		`,
		op.CostumerID,
		op.PaymentMethod,
		common.Pending,
		s.shoppingCart.CalcTotal(),
	)

	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	err = s.shoppingCart.SaveItems(id)
	if err != nil {
		return 0, err
	}

	return id, err
}

func (s *service) GetOrderItemsByOrderId(orderId int64) ([]domain.OrderItem, error) {
	rows, err := s.db.Query(`SELECT * FROM order_items WHERE order_id = ?`, orderId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []domain.OrderItem
	for rows.Next() {
		var item domain.OrderItem
		err := rows.Scan(
			&item.Id,
			&item.ProductID,
			&item.OrderID,
			&item.Quantity,
			&item.UnitPrice,
			&item.Subtotal,
		)

		if err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	return items, nil
}

func (s *service) getOrderById(id int64) (*domain.Order, error) {
	row, err := s.db.Query(`SELECT * FROM orders WHERE id = ?`, id)

	if err != nil {
		return nil, err
	}
	defer row.Close()

	var o domain.Order

	err = row.Scan(
		&o.Id,
		&o.CostumerID,
		&o.CreatedAt,
		&o.UpdatedAt,
		&o.PaymentMethod,
		&o.Status,
		&o.PaidAt,
		&o.TotalAmount,
	)

	if err != nil {
		return nil, err
	}

	return &o, nil
}

func (s *service) UpdateOrder(o *domain.Order) error {
	query := `
	UPDATE orders
	SET costumer_id = ?, create_at = ?, updated_at = ?, payment_method = ?, status = ?, paid_at = ?
	WHERE id = ? 
	`

	_, err := s.db.Exec(
		query,
		o.CostumerID,
		o.CreatedAt,
		common.CurrentTimestamp(),
		o.PaymentMethod,
		o.Status,
		o.PaidAt,
		o.Id,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *service) MarkAsPaid(orderId int64) error {
	query := "UPDATE orders SET paid_at = (DATETIME('now','utc')), status = ? WHERE id = ?"

	_, err := s.db.Exec(query, common.Paid, orderId)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) ListOrders() ([]domain.Order, error) {
	return s.fetchOrders(`SELECT * FROM orders`)
}

func (s *service) ListOrdersByDate(date time.Time) ([]domain.Order, error) {
	startDate := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	endDate := time.Date(date.Year(), date.Month(), date.Day(), 23, 59, 59, 999999999, date.Location())

	startDateString := startDate.Format("2006-01-02 15:04:05")
	endDateString := endDate.Format("2006-01-02 15:04:05")

	query := `SELECT * FROM orders WHERE created_at >= ? AND created_at <= ?`

	return s.fetchOrders(query, startDateString, endDateString)
}

func (s *service) ListOrdersByDateRange(startDate, endDate time.Time) ([]domain.Order, error) {
	endDate = endDate.Add(24 * time.Hour).Add(-time.Nanosecond)

	// Formato YYYY-MM-DD HH:MM:SS
	startDateString := startDate.Format("2006-01-02 15:04:05")
	endDateString := endDate.Format("2006-01-02 15:04:05")

	return s.fetchOrders(
		`SELECT * FROM orders WHERE created_at BETWEEN ? AND ?`,
		startDateString,
		endDateString)
}

func (s *service) fetchOrders(query string, args ...interface{}) ([]domain.Order, error) {
	rows, err := s.db.Query(query, args...)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	var orders []domain.Order
	for rows.Next() {
		var o domain.Order
		err := rows.Scan(
			&o.Id,
			&o.CostumerID,
			&o.CreatedAt,
			&o.UpdatedAt,
			&o.PaymentMethod,
			&o.Status,
			&o.PaidAt,
			&o.TotalAmount,
		)

		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		// Get order items
		items, _ := s.GetOrderItemsByOrderId(o.Id)
		o.Items = items

		orders = append(orders, o)
	}

	return orders, nil
}
