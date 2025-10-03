package domain

import (
	"net/mail"
	"regexp"
	"strings"
)

// Email (validated, lower-cased)
type Email string

func NewEmail(v string) (Email, error) {
	addr, err := mail.ParseAddress(strings.TrimSpace(v))
	if err != nil || addr.Address == "" {
		return "", ErrInvalidEmail
	}
	return Email(strings.ToLower(addr.Address)), nil
}

// Slug: kebab-case a-z0-9 and dashes
type Slug string

var slugRe = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

func NewSlug(v string) (Slug, error) {
	v = strings.TrimSpace(strings.ToLower(v))
	if !slugRe.MatchString(v) {
		return "", ErrInvalidSlug
	}
	return Slug(v), nil
}

// Rating is a 1..5 star integer
type Rating int

func NewRating(n int) (Rating, error) {
	if n < 1 || n > 5 {
		return 0, ErrInvalidRating
	}
	return Rating(n), nil
}

// ProductCategory (extend freely)
type ProductCategory string

const (
	CategoryHosting        ProductCategory = "hosting"
	CategoryFeatureToggles ProductCategory = "feature_toggles"
	CategoryCI             ProductCategory = "ci_cd"
	CategoryObservability  ProductCategory = "observability"
	CategoryOther          ProductCategory = "other"
)
