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
	CostumerID    int64       `json:"costumer_id"`
	Items         []OrderItem `json:"items"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
	PaymentMethod string      `json:"payment_method"`
	Status        string      `json:"status"`
	PaidAt        time.Time   `json:"paid_at"`
	TotalAmount   float64     `json:"total_amount"`
}

type OrderPayload struct {
	CostumerID    *int64 `json:"costumer_id"`
	PaymentMethod string `json:"payment_method"`
}

type Transaction struct {
	Id        int64
	OrderID   int64     // ID de la orden asociada
	Amount    float64   // Monto de la transacción
	Type      string    // "pago", "ajuste", etc.
	CreatedAt time.Time // Fecha de la transacción
}

type Message struct {
	Success bool
	Error   string
}
