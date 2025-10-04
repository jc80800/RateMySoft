package middleware

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// AuthMiddleware handles authentication for protected routes
func AuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")

			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Missing or invalid authorization header",
				})
			}

			token := strings.TrimPrefix(authHeader, "Bearer ")

			// For now, just check if token exists (simple validation)
			if token == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid token",
				})
			}

			// Set placeholder user info in context
			c.Set("user_id", "placeholder_user_id")
			c.Set("user_email", "user@example.com")
			c.Set("user_name", "User Name")

			return next(c)
		}
	}
}
