package dto

import "time"

// CreateReviewRequest represents the request body for creating a review
type CreateReviewRequest struct {
	ProductID string `json:"product_id" validate:"required,uuid"`
	Title     string `json:"title" validate:"omitempty,max=200"`
	Body      string `json:"body" validate:"required,min=10"`
	Rating    int    `json:"rating" validate:"required,min=1,max=5"`
}

// UpdateReviewRequest represents the request body for updating a review
type UpdateReviewRequest struct {
	Title  string `json:"title" validate:"omitempty,max=200"`
	Body   string `json:"body" validate:"required,min=10"`
	Rating int    `json:"rating" validate:"required,min=1,max=5"`
}

// ReviewResponse represents a review in API responses
type ReviewResponse struct {
	ID           string     `json:"id"`
	ProductID    string     `json:"product_id"`
	UserID       string     `json:"user_id"`
	Title        string     `json:"title,omitempty"`
	Body         string     `json:"body"`
	Rating       int        `json:"rating"`
	Status       string     `json:"status"`
	HelpfulCount int        `json:"helpful_count"`
	FlagCount    int        `json:"flag_count"`
	Edited       bool       `json:"edited"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

// ReviewWithUserResponse represents a review with user information
type ReviewWithUserResponse struct {
	ReviewResponse
	UserHandle string `json:"user_handle"`
}

// ReviewWithProductResponse represents a review with product information
type ReviewWithProductResponse struct {
	ReviewResponse
	ProductName string `json:"product_name"`
	ProductSlug string `json:"product_slug"`
	CompanyName string `json:"company_name"`
}

// ReviewListResponse represents a paginated list of reviews
type ReviewListResponse struct {
	Reviews []ReviewResponse `json:"reviews"`
	Total   int64            `json:"total"`
	Limit   int32            `json:"limit"`
	Offset  int32            `json:"offset"`
}
