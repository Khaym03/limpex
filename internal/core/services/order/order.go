package order

import (
	"database/sql"
	"fmt"
	"math"
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
	if op.CustomerId != nil {
		return nil
	}

	items, err := s.GetOrderItemsByOrderId(id)
	if err != nil {
		fmt.Println(err)
		return err
	}

	err = s.AddPayment(id, common.CalcTotalAmount(items))
	if err != nil {
		fmt.Println(err)
		return err
	}

	err = s.CheckAndUpdateOrderStatus(id, *op.PaymentMethod)
	if err != nil {
		fmt.Println(err)
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
	result, err := s.db.Exec(`
		INSERT INTO orders(customer_id, payment_method, status, total_amount)
		VALUES (?, ?, ?, ?)
		`,
		op.CustomerId,
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
	rows, err := s.db.Query(`
		SELECT id, product_id, order_id, quantity, unit_price, subtotal
		FROM order_items
		WHERE order_id = ?`,
		orderId,
	)
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
	var o domain.Order

	row := s.db.QueryRow(`SELECT * FROM orders WHERE id = ?`, id)

	err := row.Scan(
		&o.Id,
		&o.CustomerId,
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
		o.CustomerId,
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

func (s *service) AddPayment(orderId int64, amount float64) error {
	// Verifica que la orden exista
	_, err := s.getOrderById(orderId)
	if err != nil {
		return err
	}

	// Registra el pago
	_, err = s.db.Exec(`
        INSERT INTO order_payments (order_id, amount)
        VALUES (?, ?)`,
		orderId,
		amount,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) GetTotalPayments(orderId int64) (float64, error) {
	rows, err := s.db.Query(`
        SELECT SUM(amount) FROM order_payments WHERE order_id = ?`,
		orderId,
	)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var total sql.NullFloat64 // sql.NullFloat64 to handle nil values
	if rows.Next() {
		if err := rows.Scan(&total); err != nil {
			return 0, err
		}
	} else if err := rows.Err(); err != nil {
		return 0, err
	}

	if !total.Valid {
		return 0, nil
	}

	return total.Float64, nil
}

func (s *service) CheckAndUpdateOrderStatus(orderId int64, paymentMethod string) error {
	order, err := s.getOrderById(orderId)
	if err != nil {
		return err
	}

	totalPayments, err := s.GetTotalPayments(orderId)
	if err != nil {
		return err
	}

	if math.Round(totalPayments*100) >= math.Round(order.TotalAmount*100) {
		return s.MarkAsPaid(orderId, paymentMethod)
	}

	return nil
}

func (s *service) MakeAPartialPayment(orderId int64, amount float64, paymentMethod string) error {
	err := s.AddPayment(orderId, amount)
	if err != nil {
		return err
	}

	err = s.CheckAndUpdateOrderStatus(orderId, paymentMethod)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) MarkAsPaid(orderId int64, paymentMethod string) error {
	query := `
		UPDATE orders
		SET paid_at = (DATETIME('now','utc')),
		updated_at = (DATETIME('now','utc')),
		status = ?,
		payment_method = ?
		WHERE id = ?
	`

	_, err := s.db.Exec(query, common.Paid, paymentMethod, orderId)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) ListOrders() ([]domain.Order, error) {
	return s.fetchOrders(`SELECT * FROM orders`)
}

func (s *service) ListOrdersByDate(date time.Time, clientTimeZone string) ([]domain.Order, error) {
	loc, err := time.LoadLocation(clientTimeZone)
	if err != nil {
		return nil, fmt.Errorf("invalid time zone: %v", err)
	}

	startDateUTC, endDateUTC := convertToUTC(date, loc)

	query := `SELECT * FROM orders WHERE created_at BETWEEN ? AND ?`

	return s.fetchOrders(query, startDateUTC, endDateUTC)
}

func (s *service) ListOrdersByDateRange(startDate, endDate time.Time, clientTimeZone string) ([]domain.Order, error) {
	loc, err := time.LoadLocation(clientTimeZone)
	if err != nil {
		return nil, fmt.Errorf("invalid time zone: %v", err)
	}

	startDateUTC, _ := convertToUTC(startDate, loc)
	_, endDateUTC := convertToUTC(endDate, loc)

	startDateString := startDateUTC.Format("2006-01-02 15:04:05")
	endDateString := endDateUTC.Format("2006-01-02 15:04:05")

	query := `SELECT * FROM orders WHERE created_at BETWEEN ? AND ?`

	return s.fetchOrders(query, startDateString, endDateString)
}

func (s *service) ListOrdersByStatus(status string) ([]domain.Order, error) {
	return s.fetchOrders(`SELECT * FROM orders WHERE status = ?`, status)
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
			&o.CustomerId,
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

func convertToUTC(date time.Time, loc *time.Location) (time.Time, time.Time) {
	clientDate := date.In(loc)

	startDate := time.Date(clientDate.Year(), clientDate.Month(), clientDate.Day(), 0, 0, 0, 0, loc)
	endDate := time.Date(clientDate.Year(), clientDate.Month(), clientDate.Day(), 23, 59, 59, 999999999, loc)

	startDateUTC := startDate.UTC()
	endDateUTC := endDate.UTC()

	return startDateUTC, endDateUTC
}

func (s *service) DeleteOrder(id int64) error {
	row, err := s.db.Exec(`DELETE FROM orders WHERE id = ?`, id)
	if err != nil {
		return fmt.Errorf("failed to delete order with id %d: %w", id, err)
	}

	// Since when delete a order from here dont delete the order_items related
	// implement this fix until could find a better solution
	if affected, err := row.RowsAffected(); affected <= 1 {
		fmt.Println(err)
		s.deleteRaletedOrderItems(id)
	}

	return nil
}

func (s *service) deleteRaletedOrderItems(id int64) {
	_, err := s.db.Exec(`DELETE FROM order_items WHERE order_id = ?`, id)
	if err != nil {
		fmt.Println(err)
	}
}

func (s *service) OrdersSummaryByDate(startDate, endDate time.Time, clientTimeZone string) ([]domain.Order, error) {
	loc, err := time.LoadLocation(clientTimeZone)
	if err != nil {
		return nil, fmt.Errorf("invalid time zone: %v", err)
	}

	startDateUTC, _ := convertToUTC(startDate, loc)
	_, endDateUTC := convertToUTC(endDate, loc)

	startDateString := startDateUTC.Format("2006-01-02 15:04:05")
	endDateString := endDateUTC.Format("2006-01-02 15:04:05")

	query := `
	SELECT * FROM orders
	WHERE created_at BETWEEN ? AND ?
	ORDER BY created_at`

	return s.fetchOrders(query, startDateString, endDateString)
}

func (s *service) GetOrdersByCustomerAndStatus(id int64, status string) ([]domain.Order, error) {

	const query = `SELECT * FROM orders WHERE customer_id = ? AND status = ?`

	return s.fetchOrders(query, id, status)
}
