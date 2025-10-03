package db

import (
	"context"
	"fmt"
	"time"

	"ratemysoft-backend/internal/models/sqlc"
	"ratemysoft-backend/internal/platform/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewDatabase creates a database connection
func NewDatabase(cfg *config.Config) (*pgxpool.Pool, *sqlc.Queries, error) {
	// Create connection pool
	pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test the connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Create queries instance
	queries := sqlc.New(pool)

	return pool, queries, nil
}
