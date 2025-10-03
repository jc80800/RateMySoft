package domain

import (
	"errors"

	"github.com/google/uuid"
)

type ID = uuid.UUID

func NewID() ID { return uuid.New() }

var ErrInvalidID = errors.New("invalid id")

func ParseID(s string) (ID, error) {
	id, err := uuid.Parse(s)
	if err != nil {
		return uuid.Nil, ErrInvalidID
	}
	return id, nil
}
