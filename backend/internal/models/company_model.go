package models

import "time"

// CompanyModel represents the database structure for a Company
type CompanyModel struct {
	ID        string     `db:"id" json:"id"`
	Name      string     `db:"name" json:"name"`
	Website   *string    `db:"website" json:"website"`
	Slug      string     `db:"slug" json:"slug"`
	LogoURL   *string    `db:"logo_url" json:"logo_url"`
	CreatedAt time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt *time.Time `db:"deleted_at" json:"deleted_at"`
}
