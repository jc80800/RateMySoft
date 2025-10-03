package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	// Create Echo instance
	e := echo.New()

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello from RateMySoft Backend!")
	})

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "healthy",
			"message": "Backend is running",
		})
	})

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}
