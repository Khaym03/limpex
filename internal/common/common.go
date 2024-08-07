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
