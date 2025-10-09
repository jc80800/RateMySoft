package main

import (
	"log"

	"ratemysoft-backend/internal/auth"
	"ratemysoft-backend/internal/platform/config"
	"ratemysoft-backend/internal/platform/db"
	"ratemysoft-backend/internal/transport/http"
	"ratemysoft-backend/internal/transport/http/handlers"
	"ratemysoft-backend/internal/utils"

	"github.com/labstack/echo/v4"
)

func main() {
	cfg := config.Load()

	pool, queries, err := db.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	// Initialize JWT service
	jwtService := auth.NewJWTService(cfg.JWTSecret, cfg.JWTExpiryHours)

	// Setup Echo server
	e := echo.New()
	e.Validator = utils.NewValidator()

	// Initialize handlers with dependencies
	handler := handlers.NewHandler(queries, jwtService)

	// Setup routes
	http.SetupRoutes(e, handler, jwtService)

	// Start server
	log.Printf("Server starting on port %s", cfg.ServerPort)
	log.Printf("JWT expiry: %d hours", cfg.JWTExpiryHours)
	e.Logger.Fatal(e.Start(":" + cfg.ServerPort))
}
