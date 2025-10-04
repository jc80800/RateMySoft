package services

import (
	"ratemysoft-backend/internal/domain"
	"ratemysoft-backend/internal/models/sqlc"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

// SQLCToDomainUser converts a SQLC User to a domain User
func SQLCToDomainUser(sqlcUser sqlc.User) (*domain.User, error) {
	// Parse email
	email, err := domain.NewEmail(sqlcUser.Email)
	if err != nil {
		return nil, err
	}

	// Convert timestamps
	createdAt := time.Time{}
	if sqlcUser.CreatedAt.Valid {
		createdAt = sqlcUser.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if sqlcUser.UpdatedAt.Valid {
		updatedAt = sqlcUser.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if sqlcUser.DeletedAt.Valid {
		deletedAt = &sqlcUser.DeletedAt.Time
	}

	return &domain.User{
		ID:        sqlcUser.ID,
		Email:     email,
		Handle:    sqlcUser.Handle,
		Role:      domain.UserRole(sqlcUser.Role),
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
		DeletedAt: deletedAt,
	}, nil
}

// DomainToSQLCUserParams converts domain data to SQLC CreateUserParams
func DomainToSQLCUserParams(userID domain.ID, email domain.Email, handle string, role domain.UserRole) sqlc.CreateUserParams {
	now := pgtype.Timestamptz{
		Time:  time.Now().UTC(),
		Valid: true,
	}

	return sqlc.CreateUserParams{
		ID:        userID,
		Email:     string(email),
		Handle:    handle,
		Role:      string(role),
		CreatedAt: now,
		UpdatedAt: now,
	}
}
