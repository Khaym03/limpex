package common

import (
	"encoding/json"
	"fmt"

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
