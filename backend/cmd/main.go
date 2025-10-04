package main

import (
	"log"

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

	e := echo.New()
	e.Validator = utils.NewValidator()

	http.SetupRoutes(e, handlers.NewHandler(queries))

	log.Printf("Server starting on port %s", cfg.ServerPort)
	e.Logger.Fatal(e.Start(":" + cfg.ServerPort))
}
