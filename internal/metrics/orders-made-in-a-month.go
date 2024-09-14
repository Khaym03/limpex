package metrics

import (
	"fmt"
	"time"

	"github.com/khaym03/limpex/internal/core/domain"
)

func (m *Metrics) OrdersMadeInAMonth(date time.Time) []domain.Order {
	fmt.Println(date)
	orders, err := m.OrderStore.OrdersMadeInAMonth(date)
	if err != nil {
		fmt.Println(err)
		return []domain.Order{}
	}
	return orders
}
