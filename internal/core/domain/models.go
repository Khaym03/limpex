package domain

import (
	"time"
)

type Customer struct {
	Id        int64     `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	CI        string    `json:"ci"`
}

type CustomerPayload struct {
	Name string `json:"name"`
	CI   string `json:"ci"`
}

type Product struct {
	Id            int64   `json:"id"`
	Name          string  `json:"name"`
	PurchasePrice float64 `json:"purchase_price"`
	SalePrice     float64 `json:"sale_price"`
}

type ProductPayload struct {
	Name          string  `json:"name"`
	PurchasePrice float64 `json:"purchase_price"`
	SalePrice     float64 `json:"sale_price"`
}

type OrderItem struct {
	Id        int64   `json:"id"`
	ProductID int64   `json:"product_id"`
	OrderID   int64   `json:"order_id"`
	Quantity  int64   `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
	Subtotal  float64 `json:"subtotal"`
}

type OrderItemPayload struct {
	ProductID int64   `json:"product_id"`
	Quantity  int64   `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
	Subtotal  float64 `json:"subtotal"`
}

type Order struct {
	Id            int64       `json:"id"`
	CustomerId    *int64      `json:"customer_id"`
	Items         []OrderItem `json:"items"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
	PaymentMethod *string     `json:"payment_method"`
	Status        string      `json:"status"`
	PaidAt        *time.Time  `json:"paid_at"`
	TotalAmount   float64     `json:"total_amount"`
}

type OrderPayload struct {
	CustomerId    *int64  `json:"customer_id"`
	PaymentMethod *string `json:"payment_method"`
}

type OrderPayments struct {
	Id        int64     `json:"id"`
	OrderID   int64     `json:"order_id"`
	Amount    float64   `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
}

type Message struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

type DateArg struct {
	Date           time.Time `json:"date"`
	ClientTimeZone string    `json:"client_time_zone"`
}

type SaleSummary struct {
	Date  string  `json:"date"`
	Total float64 `json:"total"`
}
