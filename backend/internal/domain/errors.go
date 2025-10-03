package domain

import "errors"

var (
	ErrInvalidEmail  = errors.New("invalid email")
	ErrInvalidSlug   = errors.New("invalid slug")
	ErrInvalidRating = errors.New("invalid rating")
	ErrEmptyHandle   = errors.New("handle required")
)
