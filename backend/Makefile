# Makefile for RateMySoft Backend

.PHONY: help build run test clean sqlc-generate sqlc-verify

# Default target
help:
	@echo "Available targets:"
	@echo "  build          - Build the application"
	@echo "  run            - Run the application"
	@echo "  test           - Run tests"
	@echo "  clean          - Clean build artifacts"
	@echo "  sqlc-generate  - Generate SQLC code"
	@echo "  sqlc-verify    - Verify SQLC queries"
	@echo "  install-tools  - Install development tools"

# Build the application
build:
	go build -o bin/ratemysoft ./cmd

# Run the application
run:
	go run ./cmd

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf bin/
	go clean

# Generate SQLC code
sqlc-generate:
	sqlc generate

# Verify SQLC queries
sqlc-verify:
	sqlc vet

# Install development tools
install-tools:
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Setup development environment
setup: install-tools
	go mod tidy
	go mod download
