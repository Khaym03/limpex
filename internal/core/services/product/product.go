package product

import (
	"database/sql"
	"fmt"

	"github.com/khaym03/limpex/internal/core/domain"
)

type Service struct {
	db      *sql.DB
	scanner ProductScanner
}

func NewService(db *sql.DB) *Service {
	return &Service{
		db:      db,
		scanner: ProductScanner{},
	}
}

func (s *Service) CreateProduct(pp domain.ProductPayload) (int64, error) {
	result, err := s.db.Exec(`
		INSERT INTO products(name, purchase_price, sale_price) VALUES (?,?,?)
	`,
		pp.Name, pp.PurchasePrice, pp.SalePrice,
	)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, err
}

func (s *Service) GetCleaningProducts() []domain.Product {
	cleaningRows, err := s.db.Query(`
	SELECT id, name, purchase_price, sale_price
	FROM products`)
	if err != nil {
		fmt.Println(err)
	}
	defer cleaningRows.Close()

	products, err := s.scanner.ScanProducts(cleaningRows)
	if err != nil {
		fmt.Println(err)
		return []domain.Product{}
	}
	// var cleaningProducts []domain.Product
	// for cleaningRows.Next() {
	// 	var cp domain.Product
	// 	err := cleaningRows.Scan(
	// 		&cp.Id,
	// 		&cp.Name,
	// 		&cp.PurchasePrice,
	// 		&cp.SalePrice,
	// 	)
	// 	if err != nil {
	// 		fmt.Println(err)
	// 	}
	// 	cleaningProducts = append(cleaningProducts, cp)
	// }

	return products
}

func (s *Service) DeleteById(id int64) error {
	_, err := s.db.Exec("DELETE FROM products WHERE id=?", id)
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) GetById(id int64) (*domain.Product, error) {
	rows, err := s.db.Query(`
	SELECT p.id, p.name, p.purchase_price, p.sale_price
	FROM products AS p
	WHERE p.id = ?
	`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, fmt.Errorf("no cleaning product found with id %d", id)
	}

	product, err := s.scanner.ScanProduct(rows)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	// var cp domain.Product

	// err = rows.Scan(
	// 	&cp.Id,
	// 	&cp.Name,
	// 	&cp.PurchasePrice,
	// 	&cp.SalePrice,
	// )

	// if err != nil {
	// 	return nil, err
	// }

	return product, nil
}

func (s *Service) UpdateCleaningProduct(cp domain.Product) error {
	_, err := s.db.Exec(`
		UPDATE products SET name = ?, purchase_price = ?, sale_price = ? WHERE id = ?
	`,
		cp.Name, cp.PurchasePrice, cp.SalePrice, cp.Id,
	)
	if err != nil {
		return fmt.Errorf("error updating product: %w", err)
	}

	return nil
}
