package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// CORSConfig holds CORS configuration
type CORSConfig struct {
	// AllowedOrigins is a list of origins that are allowed to make requests
	AllowedOrigins []string

	// AllowedMethods is a list of HTTP methods that are allowed
	AllowedMethods []string

	// AllowedHeaders is a list of headers that are allowed in requests
	AllowedHeaders []string

	// ExposedHeaders is a list of headers that are exposed to the client
	ExposedHeaders []string

	// AllowCredentials indicates whether credentials are allowed
	AllowCredentials bool

	// MaxAge is the maximum age for preflight requests in seconds
	MaxAge int
}

// DefaultCORSConfig returns a default CORS configuration for development
func DefaultCORSConfig() *CORSConfig {
	return &CORSConfig{
		AllowedOrigins: []string{
			"http://localhost:5173", // Vite dev server
			"http://127.0.0.1:5173", // Alternative localhost
			"http://localhost:3000", // React dev server
			"http://localhost:8080", // Alternative dev port
		},
		AllowedMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH",
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-Requested-With",
			"Origin",
			"X-CSRF-Token",
		},
		ExposedHeaders: []string{
			"Content-Length",
			"Content-Type",
		},
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	}
}

// ProductionCORSConfig returns a CORS configuration for production
func ProductionCORSConfig(productionOrigins []string) *CORSConfig {
	config := DefaultCORSConfig()
	config.AllowedOrigins = productionOrigins
	return config
}

// CORS middleware that follows industry best practices
func CORS(config *CORSConfig) echo.MiddlewareFunc {
	if config == nil {
		config = DefaultCORSConfig()
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			origin := c.Request().Header.Get("Origin")

			// Check if origin is allowed
			if isOriginAllowed(origin, config.AllowedOrigins) {
				c.Response().Header().Set("Access-Control-Allow-Origin", origin)
				c.Response().Header().Set("Access-Control-Allow-Credentials", "true")
			}

			// Set CORS headers for all requests
			c.Response().Header().Set("Access-Control-Allow-Methods", strings.Join(config.AllowedMethods, ", "))
			c.Response().Header().Set("Access-Control-Allow-Headers", strings.Join(config.AllowedHeaders, ", "))
			c.Response().Header().Set("Access-Control-Expose-Headers", strings.Join(config.ExposedHeaders, ", "))
			c.Response().Header().Set("Access-Control-Max-Age", fmt.Sprintf("%d", config.MaxAge))

			// Handle preflight OPTIONS requests immediately
			// This prevents OPTIONS requests from going through auth middleware
			if c.Request().Method == http.MethodOptions {
				return c.NoContent(http.StatusNoContent)
			}

			return next(c)
		}
	}
}

// isOriginAllowed checks if the given origin is in the allowed list
func isOriginAllowed(origin string, allowedOrigins []string) bool {
	if origin == "" {
		return false
	}

	for _, allowed := range allowedOrigins {
		if origin == allowed {
			return true
		}
	}

	return false
}

// CORSWithEnvironment returns CORS middleware based on environment
func CORSWithEnvironment(env string, productionOrigins []string) echo.MiddlewareFunc {
	switch env {
	case "production":
		return CORS(ProductionCORSConfig(productionOrigins))
	case "staging":
		// Add staging-specific origins
		stagingConfig := DefaultCORSConfig()
		stagingConfig.AllowedOrigins = append(stagingConfig.AllowedOrigins, productionOrigins...)
		return CORS(stagingConfig)
	default: // development
		return CORS(DefaultCORSConfig())
	}
}
