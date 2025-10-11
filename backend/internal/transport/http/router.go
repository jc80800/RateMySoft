package http

import (
	"ratemysoft-backend/internal/auth"
	"ratemysoft-backend/internal/transport/http/handlers"
	"ratemysoft-backend/internal/transport/http/middleware"

	"github.com/labstack/echo/v4"
)

// SetupRoutes configures all HTTP routes
func SetupRoutes(e *echo.Echo, h *handlers.Handler, jwtService *auth.JWTService) {
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
	authGroup := v1.Group("/auth")
	authGroup.POST("/login", h.Login)
	authGroup.POST("/register", h.Register)

	// Protected auth routes (require authentication)
	authProtected := v1.Group("/auth", middleware.AuthMiddleware(jwtService))
	authProtected.GET("/profile", h.GetProfile)
	// authProtected.POST("/logout", h.Logout)
	// authProtected.PUT("/profile", h.UpdateProfile)

	// Company routes - mixed public and protected
	companies := v1.Group("/companies")
	companies.GET("", h.ListCompanies)               // Public
	companies.GET("/search", h.SearchCompanies)      // Public
	companies.GET("/:id", h.GetCompany)              // Public
	companies.GET("/slug/:slug", h.GetCompanyBySlug) // Public

	// Protected company routes (require auth)
	companies.POST("", h.CreateCompany, middleware.AuthMiddleware(jwtService))
	companies.PUT("/:id", h.UpdateCompany, middleware.AuthMiddleware(jwtService))
	companies.DELETE("/:id", h.DeleteCompany, middleware.AuthMiddleware(jwtService))

	// Product routes - mixed public and protected
	products := v1.Group("/products")
	products.GET("", h.ListProducts)                              // Public
	products.GET("/search", h.SearchProducts)                     // Public
	products.GET("/category/:category", h.ListProductsByCategory) // Public
	products.GET("/company/:companyId", h.GetProductsByCompany)   // Public
	products.GET("/:id", h.GetProduct)                            // Public
	products.GET("/slug/:slug", h.GetProductBySlug)               // Public

	// Protected product routes (require auth)
	products.POST("", h.CreateProduct, middleware.AuthMiddleware(jwtService))
	products.PUT("/:id", h.UpdateProduct, middleware.AuthMiddleware(jwtService))
	products.DELETE("/:id", h.DeleteProduct, middleware.AuthMiddleware(jwtService))

	// Review routes - mixed public and protected
	reviews := v1.Group("/reviews")
	reviews.GET("/product/:productId", h.GetReviewsByProduct) // Public
	reviews.GET("/user/:userId", h.GetReviewsByUser)          // Public
	reviews.GET("/:id", h.GetReview)                          // Public

	// Protected review routes (require auth)
	reviews.POST("", h.CreateReview, middleware.AuthMiddleware(jwtService))
	reviews.PUT("/:id", h.UpdateReview, middleware.AuthMiddleware(jwtService))
	reviews.DELETE("/:id", h.DeleteReview, middleware.AuthMiddleware(jwtService))
	reviews.POST("/:id/upvote", h.UpvoteReview, middleware.AuthMiddleware(jwtService))
	reviews.POST("/:id/downvote", h.DownvoteReview, middleware.AuthMiddleware(jwtService))
	reviews.POST("/:id/flag", h.FlagReview, middleware.AuthMiddleware(jwtService))
}
