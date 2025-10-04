package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort  string
	DatabaseURL string
}

// Load loads configuration from .env file and environment variables
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables only")
	}

	serverPort := getEnv("SERVER_PORT", "8080")
	databaseURL := getEnv("DATABASE_URL", "postgres://ratemysoft_user:ratemysoft_password@localhost:5432/ratemysoft?sslmode=disable")

	return &Config{
		ServerPort:  serverPort,
		DatabaseURL: databaseURL,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
