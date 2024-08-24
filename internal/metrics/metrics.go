package metrics

import (
	"context"
	"fmt"
	"sync"

	"github.com/khaym03/limpex/internal/adapters/repository"
	"github.com/khaym03/limpex/internal/core/domain"
	"github.com/khaym03/limpex/internal/core/ports"
	"github.com/khaym03/limpex/internal/core/services/order"
)

type Metrics struct {
	OrderStore ports.OrderStore
	ctx        context.Context
}

var metricsInstance *Metrics
var once sync.Once

func Handler() *Metrics {
	once.Do(func() {
		dbConn := repository.NewSQLiteStorage()

		// costumerSrv := costumer.NewService(dbConn)
		orderSrv := order.Service(dbConn)

		metricsInstance = &Metrics{
			OrderStore: orderSrv,
		}
	})

	return metricsInstance
}

func (m *Metrics) Start(ctx context.Context) {
	m.ctx = ctx
}

func (m *Metrics) OrdersSummaryByDate(fromDate domain.DateArg, toDate domain.DateArg) []domain.Order {
	orders, err := m.OrderStore.OrdersSummaryByDate(fromDate.Date, toDate.Date, fromDate.ClientTimeZone)
	if err != nil {
		fmt.Println(err)
	}
	return orders
}
