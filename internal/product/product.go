package product

import (
	"database/sql"
	"fmt"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{db: db}
}

func (s *Service) CreateProduct(name string, price float64) (int64, error) {
	result, err := s.db.Exec("INSERT INTO products(name,price) VALUES (?,?)", name, price)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, err
}

func (s *Service) CreateCleaningProduct(name string, price float64, color string) error {
	id, err := s.CreateProduct(name, price)
	if err != nil {
		return err
	}

	_, err = s.db.Exec("INSERT INTO cleaning_products (product_id,color) VALUES (?,?)", id, color)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) GetProducts() {
	r, err := s.db.Exec("SELECT * FROM products")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(r)
}
