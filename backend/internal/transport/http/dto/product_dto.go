package dto

import "time"

// CreateProductRequest represents the request body for creating a product
type CreateProductRequest struct {
	CompanyID    string `json:"company_id" validate:"required,uuid"`
	Name         string `json:"name" validate:"required,min=1,max=200"`
	Slug         string `json:"slug" validate:"required,min=1,max=100"`
	Category     string `json:"category" validate:"required,oneof=hosting feature_toggles ci_cd observability other"`
	ShortTagline string `json:"short_tagline" validate:"omitempty,max=200"`
	Description  string `json:"description" validate:"omitempty"`
	HomepageURL  string `json:"homepage_url" validate:"omitempty,url"`
	DocsURL      string `json:"docs_url" validate:"omitempty,url"`
}

// UpdateProductRequest represents the request body for updating a product
type UpdateProductRequest struct {
	Name         string `json:"name" validate:"required,min=1,max=200"`
	Slug         string `json:"slug" validate:"required,min=1,max=100"`
	Category     string `json:"category" validate:"required,oneof=hosting feature_toggles ci_cd observability other"`
	ShortTagline string `json:"short_tagline" validate:"omitempty,max=200"`
	Description  string `json:"description" validate:"omitempty"`
	HomepageURL  string `json:"homepage_url" validate:"omitempty,url"`
	DocsURL      string `json:"docs_url" validate:"omitempty,url"`
}

// ProductResponse represents a product in API responses
type ProductResponse struct {
	ID           string     `json:"id"`
	CompanyID    string     `json:"company_id"`
	Name         string     `json:"name"`
	Slug         string     `json:"slug"`
	Category     string     `json:"category"`
	ShortTagline string     `json:"short_tagline,omitempty"`
	Description  string     `json:"description,omitempty"`
	HomepageURL  string     `json:"homepage_url,omitempty"`
	DocsURL      string     `json:"docs_url,omitempty"`
	AvgRating    *float64   `json:"avg_rating,omitempty"`
	TotalReviews int        `json:"total_reviews"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

// ProductWithCompanyResponse represents a product with company information
type ProductWithCompanyResponse struct {
	ProductResponse
	CompanyName string `json:"company_name"`
	CompanySlug string `json:"company_slug"`
}

// ProductListResponse represents a paginated list of products
type ProductListResponse struct {
	Products []ProductResponse `json:"products"`
	Total    int64             `json:"total"`
	Limit    int32             `json:"limit"`
	Offset   int32             `json:"offset"`
}
