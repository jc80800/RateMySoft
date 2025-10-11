package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"ratemysoft-backend/internal/domain"
	"ratemysoft-backend/internal/models/sqlc"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

// CompanyService handles company-related business logic
type CompanyService struct {
	queries *sqlc.Queries
}

func NewCompanyService(queries *sqlc.Queries) *CompanyService {
	return &CompanyService{
		queries: queries,
	}
}

type CreateCompanyRequest struct {
	Name    string
	Website string // optional
	Slug    string
	LogoURL string // optional
}

type UpdateCompanyRequest struct {
	Name    string
	Website string
	Slug    string
	LogoURL string
}

// CreateCompany creates a new company
func (s *CompanyService) CreateCompany(ctx context.Context, req CreateCompanyRequest) (*domain.Company, error) {
	// Validate slug format
	slug, err := domain.NewSlug(req.Slug)
	if err != nil {
		return nil, fmt.Errorf("invalid slug format: %w", err)
	}

	// Check if company with this slug already exists
	_, err = s.queries.GetCompanyBySlug(ctx, req.Slug)
	if err == nil {
		return nil, fmt.Errorf("company with slug '%s' already exists", req.Slug)
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to check if company exists: %w", err)
	}

	companyID := uuid.New()
	now := pgtype.Timestamptz{
		Time:  time.Now().UTC(),
		Valid: true,
	}

	// Prepare optional fields
	var website *string
	if req.Website != "" {
		website = &req.Website
	}

	var logoURL *string
	if req.LogoURL != "" {
		logoURL = &req.LogoURL
	}

	// Create company in database
	company, err := s.queries.CreateCompany(ctx, sqlc.CreateCompanyParams{
		ID:        companyID,
		Name:      req.Name,
		Website:   website,
		Slug:      string(slug),
		LogoUrl:   logoURL,
		CreatedAt: now,
		UpdatedAt: now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create company: %w", err)
	}

	// Convert SQLC company to domain company
	return SQLCToDomainCompany(company)
}

// GetCompanyByID retrieves a company by its ID
func (s *CompanyService) GetCompanyByID(ctx context.Context, companyID string) (*domain.Company, error) {
	parsedID, err := uuid.Parse(companyID)
	if err != nil {
		return nil, fmt.Errorf("invalid company ID format: %w", err)
	}

	company, err := s.queries.GetCompany(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("company not found")
		}
		return nil, fmt.Errorf("failed to get company: %w", err)
	}

	return SQLCToDomainCompany(company)
}

// GetCompanyBySlug retrieves a company by its slug
func (s *CompanyService) GetCompanyBySlug(ctx context.Context, slug string) (*domain.Company, error) {
	// Validate slug format
	_, err := domain.NewSlug(slug)
	if err != nil {
		return nil, fmt.Errorf("invalid slug format: %w", err)
	}

	company, err := s.queries.GetCompanyBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("company not found")
		}
		return nil, fmt.Errorf("failed to get company: %w", err)
	}

	return SQLCToDomainCompany(company)
}

// ListCompanies retrieves a paginated list of companies
func (s *CompanyService) ListCompanies(ctx context.Context, limit, offset int32) ([]*domain.Company, error) {
	companies, err := s.queries.ListCompanies(ctx, sqlc.ListCompaniesParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to list companies: %w", err)
	}

	// Convert to domain companies
	domainCompanies := make([]*domain.Company, 0, len(companies))
	for _, company := range companies {
		domainCompany, err := SQLCToDomainCompany(company)
		if err != nil {
			return nil, fmt.Errorf("failed to convert company: %w", err)
		}
		domainCompanies = append(domainCompanies, domainCompany)
	}

	return domainCompanies, nil
}

// SearchCompanies searches for companies by name or slug
func (s *CompanyService) SearchCompanies(ctx context.Context, query string, limit, offset int32) ([]*domain.Company, error) {
	// Add wildcards for ILIKE search
	searchQuery := "%" + query + "%"

	companies, err := s.queries.SearchCompanies(ctx, sqlc.SearchCompaniesParams{
		Name:   searchQuery,
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to search companies: %w", err)
	}

	// Convert to domain companies
	domainCompanies := make([]*domain.Company, 0, len(companies))
	for _, company := range companies {
		domainCompany, err := SQLCToDomainCompany(company)
		if err != nil {
			return nil, fmt.Errorf("failed to convert company: %w", err)
		}
		domainCompanies = append(domainCompanies, domainCompany)
	}

	return domainCompanies, nil
}

// UpdateCompany updates an existing company
func (s *CompanyService) UpdateCompany(ctx context.Context, companyID string, req UpdateCompanyRequest) (*domain.Company, error) {
	parsedID, err := uuid.Parse(companyID)
	if err != nil {
		return nil, fmt.Errorf("invalid company ID format: %w", err)
	}

	// Validate slug format
	slug, err := domain.NewSlug(req.Slug)
	if err != nil {
		return nil, fmt.Errorf("invalid slug format: %w", err)
	}

	// Check if company exists
	existingCompany, err := s.queries.GetCompany(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("company not found")
		}
		return nil, fmt.Errorf("failed to get company: %w", err)
	}

	// If slug is changing, check if new slug is already taken
	if existingCompany.Slug != req.Slug {
		_, err = s.queries.GetCompanyBySlug(ctx, req.Slug)
		if err == nil {
			return nil, fmt.Errorf("company with slug '%s' already exists", req.Slug)
		}
		if !errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("failed to check if slug exists: %w", err)
		}
	}

	now := pgtype.Timestamptz{
		Time:  time.Now().UTC(),
		Valid: true,
	}

	// Prepare optional fields
	var website *string
	if req.Website != "" {
		website = &req.Website
	}

	var logoURL *string
	if req.LogoURL != "" {
		logoURL = &req.LogoURL
	}

	// Update company in database
	company, err := s.queries.UpdateCompany(ctx, sqlc.UpdateCompanyParams{
		ID:        parsedID,
		Name:      req.Name,
		Website:   website,
		Slug:      string(slug),
		LogoUrl:   logoURL,
		UpdatedAt: now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update company: %w", err)
	}

	return SQLCToDomainCompany(company)
}

// DeleteCompany soft deletes a company
func (s *CompanyService) DeleteCompany(ctx context.Context, companyID string) error {
	parsedID, err := uuid.Parse(companyID)
	if err != nil {
		return fmt.Errorf("invalid company ID format: %w", err)
	}

	// Check if company exists
	_, err = s.queries.GetCompany(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("company not found")
		}
		return fmt.Errorf("failed to get company: %w", err)
	}

	// Soft delete the company
	err = s.queries.SoftDeleteCompany(ctx, parsedID)
	if err != nil {
		return fmt.Errorf("failed to delete company: %w", err)
	}

	return nil
}

// CountCompanies returns the total number of companies
func (s *CompanyService) CountCompanies(ctx context.Context) (int64, error) {
	count, err := s.queries.CountCompanies(ctx)
	if err != nil {
		return 0, fmt.Errorf("failed to count companies: %w", err)
	}
	return count, nil
}

// SQLCToDomainCompany converts a SQLC Company to a domain Company
func SQLCToDomainCompany(sqlcCompany sqlc.Company) (*domain.Company, error) {
	slug, err := domain.NewSlug(sqlcCompany.Slug)
	if err != nil {
		return nil, err
	}

	// Convert timestamps
	createdAt := time.Time{}
	if sqlcCompany.CreatedAt.Valid {
		createdAt = sqlcCompany.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if sqlcCompany.UpdatedAt.Valid {
		updatedAt = sqlcCompany.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if sqlcCompany.DeletedAt.Valid {
		deletedAt = &sqlcCompany.DeletedAt.Time
	}

	website := ""
	if sqlcCompany.Website != nil {
		website = *sqlcCompany.Website
	}

	logoURL := ""
	if sqlcCompany.LogoUrl != nil {
		logoURL = *sqlcCompany.LogoUrl
	}

	return &domain.Company{
		ID:        sqlcCompany.ID,
		Name:      sqlcCompany.Name,
		Website:   website,
		Slug:      slug,
		LogoURL:   logoURL,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
		DeletedAt: deletedAt,
	}, nil
}
