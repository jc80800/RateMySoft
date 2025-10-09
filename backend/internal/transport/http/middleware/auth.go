package middleware

import (
	"net/http"
	"strings"

	"ratemysoft-backend/internal/auth"

	"github.com/labstack/echo/v4"
)

// AuthMiddleware handles JWT authentication for protected routes
func AuthMiddleware(jwtService *auth.JWTService) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")

			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Missing or invalid authorization header",
				})
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")

			if tokenString == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid token",
				})
			}

			// Validate JWT token
			claims, err := jwtService.ValidateToken(tokenString)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid or expired token",
				})
			}

			// Store user information in context
			auth.SetUserInContext(c, claims)

			return next(c)
		}
	}
}

// RequireRole creates middleware that checks if the authenticated user has a specific role
func RequireRole(role string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			userRole, err := auth.GetUserRoleFromContext(c)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "User role not found",
				})
			}

			if userRole != role {
				return c.JSON(http.StatusForbidden, map[string]string{
					"error": "Insufficient permissions",
				})
			}

			return next(c)
		}
	}
}

// RequireAdmin is a convenience middleware for admin-only routes
func RequireAdmin() echo.MiddlewareFunc {
	return RequireRole("admin")
}
