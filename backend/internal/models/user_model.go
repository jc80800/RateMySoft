package models

import "time"

// UserModel represents the database structure for a User
type UserModel struct {
	ID        string     `db:"id" json:"id"`
	Email     string     `db:"email" json:"email"`
	Handle    string     `db:"handle" json:"handle"`
	Role      string     `db:"role" json:"role"`
	TenantID  *string    `db:"tenant_id" json:"tenant_id"`
	CreatedAt time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt *time.Time `db:"deleted_at" json:"deleted_at"`
}
