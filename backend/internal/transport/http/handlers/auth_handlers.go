package handlers

import (
	"context"
	"net/http"
	"strings"
	"time"

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

	// Generate simple token for now (we'll implement proper JWT later)
	token := "simple_token_" + user.ID.String()

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

	// Generate simple token for now (we'll implement proper JWT later)
	token := "simple_token_" + user.ID.String()

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
