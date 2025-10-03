package domain

import "time"

type Company struct {
	ID        ID
	Name      string
	Website   string // optional
	Slug      Slug
	LogoURL   string // optional
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func NewCompany(name string, slug Slug, now time.Time) *Company {
	return &Company{
		ID:        NewID(),
		Name:      name,
		Slug:      slug,
		CreatedAt: now.UTC(),
		UpdatedAt: now.UTC(),
	}
}

func (c *Company) Touch(now time.Time) { c.UpdatedAt = now.UTC() }
