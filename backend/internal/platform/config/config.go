package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort     string
	DatabaseURL    string
	JWTSecret      string
	JWTExpiryHours int
}

// Load loads configuration from .env file and environment variables
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables only")
	}

	serverPort := getEnv("SERVER_PORT", "8080")
	databaseURL := getEnv("DATABASE_URL", "postgres://ratemysoft_user:ratemysoft_password@localhost:5432/ratemysoft?sslmode=disable")
	jwtSecret := getEnv("JWT_SECRET", "your-secret-key-change-this-in-production")
	jwtExpiryHours := getEnvAsInt("JWT_EXPIRY_HOURS", 24)

	// Warn if using default JWT secret
	if jwtSecret == "your-secret-key-change-this-in-production" {
		log.Println("WARNING: Using default JWT secret. Set JWT_SECRET environment variable for production!")
	}

	return &Config{
		ServerPort:     serverPort,
		DatabaseURL:    databaseURL,
		JWTSecret:      jwtSecret,
		JWTExpiryHours: jwtExpiryHours,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	var value int
	if _, err := fmt.Sscanf(valueStr, "%d", &value); err != nil {
		log.Printf("Invalid integer value for %s: %s, using default: %d", key, valueStr, defaultValue)
		return defaultValue
	}
	return value
}
