package models

import "time"

// ReviewModel represents the database structure for a Review
type ReviewModel struct {
	ID           string     `db:"id" json:"id"`
	ProductID    string     `db:"product_id" json:"product_id"`
	UserID       string     `db:"user_id" json:"user_id"`
	Title        string     `db:"title" json:"title"`
	Body         string     `db:"body" json:"body"`
	Rating       int        `db:"rating" json:"rating"`
	Status       string     `db:"status" json:"status"`
	HelpfulCount int        `db:"helpful_count" json:"helpful_count"`
	FlagCount    int        `db:"flag_count" json:"flag_count"`
	Edited       bool       `db:"edited" json:"edited"`
	CreatedAt    time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt    *time.Time `db:"deleted_at" json:"deleted_at"`
}
