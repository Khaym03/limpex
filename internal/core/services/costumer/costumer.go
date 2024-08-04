package costumer

import (
	"database/sql"
	"fmt"
	"time"

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
	createdAt := time.Now().Format(time.RFC3339)

	_, err := s.db.Exec(
		"INSERT INTO costumers(name,ci,createdAt) VALUES(?,?,?)",
		cp.Name,
		cp.CI,
		createdAt,
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
