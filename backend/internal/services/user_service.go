package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"ratemysoft-backend/internal/domain"
	"ratemysoft-backend/internal/models/sqlc"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

// UserService handles user-related business logic
type UserService struct {
	queries *sqlc.Queries
}

func NewUserService(queries *sqlc.Queries) *UserService {
	return &UserService{
		queries: queries,
	}
}

type CreateUserRequest struct {
	Email    string
	Handle   string
	Password string
}

func (s *UserService) CreateUser(ctx context.Context, req CreateUserRequest) (*domain.User, error) {
	// Check if user already exists
	_, err := s.queries.GetUserByEmail(ctx, req.Email)
	if err == nil {
		return nil, fmt.Errorf("user with email %s already exists", req.Email)
	}
	// Check if the error is "no rows found" (which is expected for new users)
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to check if user exists: %w", err)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	userID := uuid.New()

	// Create user in database
	now := pgtype.Timestamptz{
		Time:  time.Now(),
		Valid: true,
	}

	user, err := s.queries.CreateUser(ctx, sqlc.CreateUserParams{
		ID:        userID,
		Email:     req.Email,
		Handle:    req.Handle,
		Role:      "user", // default role
		CreatedAt: now,
		UpdatedAt: now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	secretHashStr := string(hashedPassword)
	_, err = s.queries.CreateCredential(ctx, sqlc.CreateCredentialParams{
		UserID:     userID,
		Provider:   "email",
		Identifier: req.Email,
		SecretHash: &secretHashStr,
		CreatedAt:  now,
		UpdatedAt:  now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create credentials: %w", err)
	}

	// Convert SQLC user back to domain user
	return SQLCToDomainUser(user)
}

// AuthenticateUser verifies user credentials and returns user info
func (s *UserService) AuthenticateUser(ctx context.Context, email, password string) (*domain.User, error) {
	// Get user by email
	user, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("invalid credentials")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Get credentials for password verification
	credential, err := s.queries.GetCredential(ctx, sqlc.GetCredentialParams{
		UserID:   user.ID,
		Provider: "email",
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("invalid credentials")
		}
		return nil, fmt.Errorf("failed to get credentials: %w", err)
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(*credential.SecretHash), []byte(password))
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Convert SQLC user back to domain user
	return SQLCToDomainUser(user)
}

func (s *UserService) GetUserByID(ctx context.Context, userID string) (*domain.User, error) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	user, err := s.queries.GetUser(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Convert SQLC user back to domain user
	return SQLCToDomainUser(user)
}
