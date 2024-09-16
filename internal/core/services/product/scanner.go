package product

import (
	"database/sql"
	"fmt"

	"github.com/khaym03/limpex/internal/core/domain"
)

type ProductScanner struct{}

func (ps ProductScanner) ScanProduct(rows *sql.Rows) (*domain.Product, error) {
	var p domain.Product
	err := rows.Scan(
		&p.Id,
		&p.Name,
		&p.PurchasePrice,
		&p.SalePrice,
	)
	if err != nil {
		return nil, fmt.Errorf("error scanning product: %w", err)
	}
	return &p, nil
}

func (ps ProductScanner) ScanProducts(rows *sql.Rows) ([]domain.Product, error) {
	var products []domain.Product
	for rows.Next() {
		p, err := ps.ScanProduct(rows)
		if err != nil {
			return nil, err
		}
		products = append(products, *p)
	}
	return products, nil
}
