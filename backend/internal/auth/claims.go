package auth

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// JWTClaims represents the claims stored in the JWT token
type JWTClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Handle string `json:"handle"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// Context keys for storing user information
const (
	ContextKeyUserID     = "user_id"
	ContextKeyUserEmail  = "user_email"
	ContextKeyUserRole   = "user_role"
	ContextKeyUserHandle = "user_handle"
)

// SetUserInContext stores user information from claims into Echo context
func SetUserInContext(c echo.Context, claims *JWTClaims) {
	c.Set(ContextKeyUserID, claims.UserID)
	c.Set(ContextKeyUserEmail, claims.Email)
	c.Set(ContextKeyUserRole, claims.Role)
	c.Set(ContextKeyUserHandle, claims.Handle)
}

// GetUserIDFromContext retrieves the user ID from the Echo context
func GetUserIDFromContext(c echo.Context) (uuid.UUID, error) {
	userIDStr, ok := c.Get(ContextKeyUserID).(string)
	if !ok {
		return uuid.Nil, fmt.Errorf("user ID not found in context")
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	return userID, nil
}

// GetUserEmailFromContext retrieves the user email from the Echo context
func GetUserEmailFromContext(c echo.Context) (string, error) {
	email, ok := c.Get(ContextKeyUserEmail).(string)
	if !ok {
		return "", fmt.Errorf("user email not found in context")
	}
	return email, nil
}

// GetUserRoleFromContext retrieves the user role from the Echo context
func GetUserRoleFromContext(c echo.Context) (string, error) {
	role, ok := c.Get(ContextKeyUserRole).(string)
	if !ok {
		return "", fmt.Errorf("user role not found in context")
	}
	return role, nil
}

// GetUserHandleFromContext retrieves the user handle from the Echo context
func GetUserHandleFromContext(c echo.Context) (string, error) {
	handle, ok := c.Get(ContextKeyUserHandle).(string)
	if !ok {
		return "", fmt.Errorf("user handle not found in context")
	}
	return handle, nil
}

// IsAdmin checks if the user in the context has admin role
func IsAdmin(c echo.Context) bool {
	role, err := GetUserRoleFromContext(c)
	if err != nil {
		return false
	}
	return role == "admin"
}
