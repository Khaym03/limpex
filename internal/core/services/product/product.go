package product

import (
	"database/sql"
	"fmt"

	"github.com/khaym03/limpex/internal/core/domain"
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

func (s *Service) GetCleaningProducts() []domain.CleaningProduct {
	// Consulta para obtener todos los productos de limpieza.
	cleaningRows, err := s.db.Query(`
	SELECT p.id, p.name, p.price, cp.color
	FROM cleaning_products AS cp
	JOIN products AS p ON cp.product_id = p.id`)
	if err != nil {
		fmt.Println(err)
	}
	defer cleaningRows.Close()

	var cleaningProducts []domain.CleaningProduct
	for cleaningRows.Next() {
		var cp domain.CleaningProduct
		err := cleaningRows.Scan(&cp.Product.Id, &cp.Product.Name, &cp.Product.Price, &cp.CleaningProductData.Color)
		if err != nil {
			fmt.Println(err)
		}
		cleaningProducts = append(cleaningProducts, cp)
	}

	fmt.Println("Productos de Limpieza:", cleaningProducts)
	return cleaningProducts
}

func (s *Service) DeleteById(id int64) error {
	_, err := s.db.Exec("DELETE FROM products WHERE id=?", id)
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) GetById(id int64) (*domain.CleaningProduct, error) {
	rows, err := s.db.Query(`
	SELECT p.id, p.name, p.price, cp.color
	FROM cleaning_products AS cp
	JOIN products AS p ON cp.product_id = p.id
	WHERE p.id = ?
	`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, fmt.Errorf("no cleaning product found with id %d", id)
	}

	var cp domain.CleaningProduct

	err = rows.Scan(
		&cp.Product.Id,
		&cp.Product.Name,
		&cp.Product.Price,
		&cp.CleaningProductData.Color)

	if err != nil {
		return nil, err
	}

	return &cp, nil
}

func (s *Service) UpdateCleaningProduct(id int64, name string, price float64, color string) error {
	_, err := s.db.Exec("UPDATE products SET name = ?, price = ? WHERE id = ?", name, price, id)
	if err != nil {
		return fmt.Errorf("error updating product: %w", err)
	}

	_, err = s.db.Exec("UPDATE cleaning_products SET color = ? WHERE product_id = ?", color, id)
	if err != nil {
		return fmt.Errorf("error updating cleaning product: %w", err)
	}

	return nil
}
