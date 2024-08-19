package costumer

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
func (s *Service) CreateCostumer(cp domain.CostumerPayload) error {
	_, err := s.db.Exec(
		"INSERT INTO costumers(name,ci) VALUES(?,?)",
		cp.Name,
		cp.CI,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) GetCostumers() []domain.Costumer {
	rows, err := s.db.Query("SELECT * FROM costumers")
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer rows.Close()

	var costumers []domain.Costumer
	for rows.Next() {
		var c domain.Costumer
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

		costumers = append(costumers, c)
	}

	return costumers
}

func (s *Service) GetCostumerById(id int64) (*domain.Costumer, error) {
	costumer, err := s.db.Query(`SELECT * FROM costumers WHERE id = ?`, id)
	if err != nil {
		return nil, err
	}
	defer costumer.Close()

	var c domain.Costumer
	for costumer.Next() {
		err = costumer.Scan(
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
