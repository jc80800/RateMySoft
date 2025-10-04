package http

import (
	"ratemysoft-backend/internal/transport/http/handlers"

	"github.com/labstack/echo/v4"
)

// SetupRoutes configures all HTTP routes
func SetupRoutes(e *echo.Echo, h *handlers.Handler) {
	// Global middleware (applies to all routes)
	// e.Use(middleware.Logger())
	// e.Use(middleware.Recover())
	// e.Use(middleware.CORS())

	// Welcome route
	e.GET("/", func(c echo.Context) error {
		return c.String(200, "RateMySoft API")
	})

	// Health check endpoint (no auth required)
	e.GET("/api/health", h.HealthCheck)

	// API version 1 routes
	v1 := e.Group("/api/v1")

	// Auth routes (no auth required)
	auth := v1.Group("/auth")
	auth.POST("/login", h.Login)
	auth.POST("/register", h.Register)

	// // Protected routes group (all routes in this group require auth)
	// protected := v1.Group("", middleware.AuthMiddleware())
	// protected.POST("/auth/logout", h.Logout)
	// protected.GET("/auth/profile", h.GetProfile)
	// protected.PUT("/auth/profile", h.UpdateProfile)

	// // Product routes - mixed public and protected
	// products := v1.Group("/products")
	// products.GET("", h.ListProducts)   // Public
	// products.GET("/:id", h.GetProduct) // Public

	// // Protected product routes (require auth)
	// products.POST("", h.CreateProduct, middleware.AuthMiddleware())
	// products.PUT("/:id", h.UpdateProduct, middleware.AuthMiddleware())
	// products.DELETE("/:id", h.DeleteProduct, middleware.AuthMiddleware())

	// // Review routes - mixed public and protected
	// reviews := v1.Group("/reviews")
	// reviews.GET("/product/:productId", h.ListReviews) // Public
	// reviews.GET("/:id", h.GetReview)                  // Public

	// // Protected review routes (require auth)
	// reviews.POST("", h.CreateReview, middleware.AuthMiddleware())
	// reviews.PUT("/:id", h.UpdateReview, middleware.AuthMiddleware())
	// reviews.DELETE("/:id", h.DeleteReview, middleware.AuthMiddleware())
}
