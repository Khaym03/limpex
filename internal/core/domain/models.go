package domain

import (
	"time"
)

type Client struct {
	Id        int64
	Name      string
	CreatedAt time.Time
	CI        int64
}

type Product struct {
	Id    int64
	Name  string
	Price float64
}

type CleaningProduct struct {
	Product
	CleaningProductData struct {
		Color string
	}
}

type OrderItemPayload struct {
	ProductID int64
	Quantity  float64
	UnitPrice float64
	Subtotal  float64
}

type OrderItem struct {
	Id        int64
	ProductID int64
	Quantity  float64
	UnitPrice float64
	Subtotal  float64
}

type Order struct {
	Id            int64
	ClientID      int64
	Items         *[]OrderItem
	CreatedAt     time.Time
	UpdatedAt     time.Time
	PaymentMethod string
	Status        string
	PaidAt        time.Time
	TotalAmount   float64
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
