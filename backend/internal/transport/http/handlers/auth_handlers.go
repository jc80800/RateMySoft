package handlers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"ratemysoft-backend/internal/auth"
	"ratemysoft-backend/internal/services"
	"ratemysoft-backend/internal/transport/http/dto"

	"github.com/labstack/echo/v4"
)

// Login authenticates a user and returns a token
func (h *Handler) Login(c echo.Context) error {
	var req dto.LoginRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	// Validate request
	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error":   "Validation failed",
			"details": err.Error(),
		})
	}

	// Create context with 10-second timeout to prevent hanging requests
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user, err := h.userService.AuthenticateUser(ctx, strings.ToLower(strings.TrimSpace(req.Email)), req.Password)
	if err != nil {
		if strings.Contains(err.Error(), "invalid credentials") {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": "Invalid email or password",
			})
		}

		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Authentication failed",
		})
	}

	// Generate JWT token
	token, err := h.jwtService.GenerateToken(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to generate authentication token",
		})
	}

	return c.JSON(http.StatusOK, dto.AuthResponse{
		Token: token,
		User: dto.UserResponse{
			ID:     user.ID.String(),
			Email:  string(user.Email),
			Handle: user.Handle,
			Role:   string(user.Role),
		},
	})
}

func (h *Handler) Register(c echo.Context) error {
	var req dto.RegisterRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error":   "Validation failed",
			"details": err.Error(),
		})
	}

	// Create context with 10-second timeout to prevent hanging requests
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user, err := h.userService.CreateUser(ctx, services.CreateUserRequest{
		Email:    strings.ToLower(strings.TrimSpace(req.Email)),
		Handle:   strings.TrimSpace(req.Handle),
		Password: req.Password,
	})
	if err != nil {
		if strings.Contains(err.Error(), "already exists") {
			return c.JSON(http.StatusConflict, map[string]string{
				"error": "User with this email already exists",
			})
		}

		// For debugging, include the actual error message
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to create user",
			"details": err.Error(),
		})
	}

	// Generate JWT token
	token, err := h.jwtService.GenerateToken(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to generate authentication token",
		})
	}

	return c.JSON(http.StatusCreated, dto.AuthResponse{
		Token: token,
		User: dto.UserResponse{
			ID:     user.ID.String(),
			Email:  string(user.Email),
			Handle: user.Handle,
			Role:   string(user.Role),
		},
	})
}

// GetProfile returns the authenticated user's profile information
func (h *Handler) GetProfile(c echo.Context) error {
	// User info is already in context from AuthMiddleware
	userID, err := auth.GetUserIDFromContext(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "User not authenticated",
		})
	}

	email, _ := auth.GetUserEmailFromContext(c)
	handle, _ := auth.GetUserHandleFromContext(c)
	role, _ := auth.GetUserRoleFromContext(c)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"id":     userID.String(),
		"email":  email,
		"handle": handle,
		"role":   role,
	})
}
