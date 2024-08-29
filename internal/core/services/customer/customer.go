package customer

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

// CI is optional.
func (s *Service) CreateCustomer(cp domain.CustomerPayload) error {
	_, err := s.db.Exec(
		"INSERT INTO customers(name,ci) VALUES(?,?)",
		cp.Name,
		cp.CI,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) GetCustomers() []domain.Customer {
	rows, err := s.db.Query("SELECT * FROM customers")
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer rows.Close()

	var customers []domain.Customer
	for rows.Next() {
		var c domain.Customer
		err := rows.Scan(
			&c.Id,
			&c.Name,
			&c.CreatedAt,
			&c.CI,
		)

		if err != nil {
			fmt.Println(err)
			return nil
		}

		customers = append(customers, c)
	}

	return customers
}

func (s *Service) GetCustomerById(id int64) (*domain.Customer, error) {
	customer, err := s.db.Query(`SELECT * FROM customers WHERE id = ?`, id)
	if err != nil {
		return nil, err
	}
	defer customer.Close()

	var c domain.Customer
	for customer.Next() {
		err = customer.Scan(
			&c.Id,
			&c.Name,
			&c.CreatedAt,
			&c.CI,
		)

		if err != nil {
			fmt.Println(err)
			return nil, err
		}
	}

	return &c, nil
}

func (s *Service) Delete(id int64) error {
	_, err := s.db.Exec(`DELETE FROM customers WHERE id = ?`, id)
	if err != nil {
		fmt.Println(err)
		return err
	}

	_, err = s.db.Exec(`UPDATE orders SET customer_id = null  WHERE customer_id = ?`, id)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}
