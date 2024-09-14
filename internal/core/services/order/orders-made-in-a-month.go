package order

import (
	"fmt"
	"time"

	"github.com/khaym03/limpex/internal/common"
	"github.com/khaym03/limpex/internal/core/domain"
)

func (s *service) OrdersMadeInAMonth(date time.Time) ([]domain.Order, error) {
	startOfMonth := common.GetStartOfMonth(date)
	endOfMonth := common.GetEndOfMonth(date)

	startOfMonthUTC := startOfMonth.UTC().Format("2006-01-02 15:04:05")
	endOfMonthUTC := endOfMonth.UTC().Format("2006-01-02 15:04:05")

	fmt.Println(startOfMonthUTC, endOfMonthUTC)

	query := `
	SELECT * FROM orders
	WHERE created_at BETWEEN ? AND ?
	ORDER BY created_at;`

	return s.fetchOrders(query, startOfMonthUTC, endOfMonthUTC)
}
