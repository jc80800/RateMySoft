package models

import "time"

// ProductModel represents the database structure for a Product
type ProductModel struct {
	ID           string     `db:"id" json:"id"`
	CompanyID    string     `db:"company_id" json:"company_id"`
	Name         string     `db:"name" json:"name"`
	Slug         string     `db:"slug" json:"slug"`
	Category     string     `db:"category" json:"category"`
	ShortTagline string     `db:"short_tagline" json:"short_tagline"`
	Description  string     `db:"description" json:"description"`
	HomepageURL  string     `db:"homepage_url" json:"homepage_url"`
	DocsURL      string     `db:"docs_url" json:"docs_url"`
	AvgRating    *float64   `db:"avg_rating" json:"avg_rating"`
	TotalReviews int        `db:"total_reviews" json:"total_reviews"`
	CreatedAt    time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt    *time.Time `db:"deleted_at" json:"deleted_at"`
}
