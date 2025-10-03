package config

// Config holds minimal configuration for our application
type Config struct {
	// Server configuration
	ServerPort string

	// Database configuration
	DatabaseURL string
}

// Load loads configuration with minimal defaults
func Load() *Config {
	return &Config{
		ServerPort:  "8080",
		DatabaseURL: "postgres://user:password@localhost/ratemysoft?sslmode=disable",
	}
}
