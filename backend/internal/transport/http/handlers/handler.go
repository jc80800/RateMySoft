package handlers

import (
	"context"
	"net/http"
	"time"

	"ratemysoft-backend/internal/models/sqlc"
	"ratemysoft-backend/internal/services"

	"github.com/labstack/echo/v4"
)

// Handler holds dependencies for HTTP handlers
type Handler struct {
	queries     *sqlc.Queries
	userService *services.UserService
}

func NewHandler(queries *sqlc.Queries) *Handler {
	return &Handler{
		queries:     queries,
		userService: services.NewUserService(queries),
	}
}

func (h *Handler) HealthCheck(c echo.Context) error {
	// Test database connectivity with 5-second timeout for health check
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Try a simple database query to check connectivity
	_, err := h.queries.ListUsers(ctx, sqlc.ListUsersParams{
		Limit:  1,
		Offset: 0,
	})
	dbStatus := "healthy"
	if err != nil {
		dbStatus = "unhealthy"
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"database":  dbStatus,
		"service":   "RateMySoft API",
	})
}
