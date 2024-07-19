package common

import "github.com/khaym03/limpex/internal/core/domain"

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
