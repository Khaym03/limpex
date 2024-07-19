package domain

import (
	"time"
)

type Id = uint64

type Client struct {
	Id
	Name      string
	CreatedAt time.Time
}

type Product struct {
	Id
	Name  string
	Price float64
}

type CleaningProduct struct {
	Product
	CleaningProductData struct {
		Color string
	}
}

type OrderItem struct {
	Id
	Quantity   float64
	TotalPrice float64
}

type Order struct {
	Id
	Items     *[]OrderItem
	CreatedAt time.Time
	Status    string
}

type Message struct {
	Success bool
	Error   string
}
