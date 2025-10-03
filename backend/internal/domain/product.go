package domain

import "time"

// Product is a specific software solution owned by a Company.
type Product struct {
	ID           ID
	CompanyID    ID
	Name         string
	Slug         Slug
	Category     ProductCategory
	ShortTagline string
	Description  string
	HomepageURL  string
	DocsURL      string

	// Denormalized stats (optional, recomputed by services/workers)
	AvgRating    *float64
	TotalReviews int

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func NewProduct(companyID ID, name string, slug Slug, cat ProductCategory, now time.Time) *Product {
	return &Product{
		ID:        NewID(),
		CompanyID: companyID,
		Name:      name,
		Slug:      slug,
		Category:  cat,
		CreatedAt: now.UTC(),
		UpdatedAt: now.UTC(),
	}
}

func (p *Product) Touch(now time.Time) { p.UpdatedAt = now.UTC() }
