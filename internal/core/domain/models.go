package domain

import (
	"time"
)

type Costumer struct {
	Id        int64     `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	CI        string    `json:"ci"`
}

type CostumerPayload struct {
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
	Quantity  float64 `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
	Subtotal  float64 `json:"subtotal"`
}

type OrderItemPayload struct {
	ProductID int64   `json:"product_id"`
	Quantity  float64 `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
	Subtotal  float64 `json:"subtotal"`
}

type Order struct {
	Id            int64       `json:"id"`
	CostumerID    *int64      `json:"costumer_id"`
	Items         []OrderItem `json:"items"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
	PaymentMethod *string     `json:"payment_method"`
	Status        string      `json:"status"`
	PaidAt        *time.Time  `json:"paid_at"`
	TotalAmount   float64     `json:"total_amount"`
}

type OrderPayload struct {
	CostumerID    *int64  `json:"costumer_id"`
	PaymentMethod *string `json:"payment_method"`
}

type OrderPayments struct {
	Id        int64     `json:"id"`
	OrderID   int64     `json:"order_id"`
	Amount    float64   `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
}

type Message struct {
	Success bool
	Error   string
}

type DateArg struct {
	Date           time.Time `json:"date"`
	ClientTimeZone string    `json:"client_time_zone"`
}
