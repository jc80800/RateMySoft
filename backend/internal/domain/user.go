package domain

import (
	"strings"
	"time"
)

type UserRole string

const (
	RoleUser  UserRole = "user"
	RoleAdmin UserRole = "admin"
)

type User struct {
	ID        ID
	Email     Email
	Handle    string // public username
	Role      UserRole
	TenantID  *ID // keep optional multi-tenant path
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func NewUser(email Email, handle string, now time.Time) (*User, error) {
	if strings.TrimSpace(handle) == "" {
		return nil, ErrEmptyHandle
	}
	return &User{
		ID:        NewID(),
		Email:     email,
		Handle:    handle,
		Role:      RoleUser,
		CreatedAt: now.UTC(),
		UpdatedAt: now.UTC(),
	}, nil
}

func (u *User) Touch(now time.Time) { u.UpdatedAt = now.UTC() }
