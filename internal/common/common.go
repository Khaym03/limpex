package common

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/khaym03/limpex/internal/core/domain"
)

func MakeMessage(err error) domain.Message {
	if err != nil {
		return domain.Message{
			Success: false,
			Error:   err.Error(),
		}
	}

	return domain.Message{
		Success: true,
		Error:   "",
	}
}

func CurrentTimestamp() string {
	return time.Now().Format(time.RFC3339)
}

func JSToStruc(v any, shape interface{}) {
	data, err := json.Marshal(v)
	if err != nil {
		fmt.Println(err)
	}

	err = json.Unmarshal(data, &shape)
	if err != nil {
		fmt.Println(err)
	}
}

func StructToJS(v any) string {
	data, err := json.Marshal(v)
	if err != nil {
		fmt.Println(err)
	}
	return string(data)
}

func CalcTotalAmount(items []domain.OrderItem) float64 {
	var total float64 = 0

	for _, item := range items {
		total += item.Subtotal
	}

	return total
}

func GetStartOfMonth(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, t.Location())
}

func GetEndOfMonth(date time.Time) time.Time {
	year, month, _ := date.Date()
	location := date.Location()

	// Creamos una nueva fecha con el primer día del siguiente mes
	firstDayOfNextMonth := time.Date(year, month+1, 1, 0, 0, 0, 0, location)

	// Restamos un día para obtener el último día del mes actual
	lastDay := firstDayOfNextMonth.Add(-time.Nanosecond)

	// Devolvemos la fecha en formato UTC
	return lastDay.UTC()
}
