package dto

import "time"

// CreateCompanyRequest represents the request body for creating a company
type CreateCompanyRequest struct {
	Name    string `json:"name" validate:"required,min=1,max=100"`
	Website string `json:"website" validate:"omitempty,url"`
	Slug    string `json:"slug" validate:"required,min=1,max=100"`
	LogoURL string `json:"logo_url" validate:"omitempty,url"`
}

// UpdateCompanyRequest represents the request body for updating a company
type UpdateCompanyRequest struct {
	Name    string `json:"name" validate:"required,min=1,max=100"`
	Website string `json:"website" validate:"omitempty,url"`
	Slug    string `json:"slug" validate:"required,min=1,max=100"`
	LogoURL string `json:"logo_url" validate:"omitempty,url"`
}

// CompanyResponse represents a company in API responses
type CompanyResponse struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Website   string     `json:"website,omitempty"`
	Slug      string     `json:"slug"`
	LogoURL   string     `json:"logo_url,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

// CompanyListResponse represents a paginated list of companies
type CompanyListResponse struct {
	Companies []CompanyResponse `json:"companies"`
	Total     int64             `json:"total"`
	Limit     int32             `json:"limit"`
	Offset    int32             `json:"offset"`
}
