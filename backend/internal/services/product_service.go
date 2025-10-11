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

// ProductService handles product-related business logic
type ProductService struct {
	queries *sqlc.Queries
}

func NewProductService(queries *sqlc.Queries) *ProductService {
	return &ProductService{
		queries: queries,
	}
}

type CreateProductRequest struct {
	CompanyID    string
	Name         string
	Slug         string
	Category     string
	ShortTagline string
	Description  string
	HomepageURL  string
	DocsURL      string
}

type UpdateProductRequest struct {
	Name         string
	Slug         string
	Category     string
	ShortTagline string
	Description  string
	HomepageURL  string
	DocsURL      string
}

// CreateProduct creates a new product
func (s *ProductService) CreateProduct(ctx context.Context, req CreateProductRequest) (*domain.Product, error) {
	// Validate company ID
	companyID, err := uuid.Parse(req.CompanyID)
	if err != nil {
		return nil, fmt.Errorf("invalid company ID format: %w", err)
	}

	// Check if company exists
	_, err = s.queries.GetCompany(ctx, companyID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("company not found")
		}
		return nil, fmt.Errorf("failed to check company: %w", err)
	}

	// Validate slug format
	slug, err := domain.NewSlug(req.Slug)
	if err != nil {
		return nil, fmt.Errorf("invalid slug format: %w", err)
	}

	// Validate category
	category := domain.ProductCategory(req.Category)
	if !isValidCategory(category) {
		return nil, fmt.Errorf("invalid category: %s", req.Category)
	}

	productID := uuid.New()
	now := pgtype.Timestamptz{
		Time:  time.Now().UTC(),
		Valid: true,
	}

	// Prepare optional fields
	var shortTagline *string
	if req.ShortTagline != "" {
		shortTagline = &req.ShortTagline
	}

	var description *string
	if req.Description != "" {
		description = &req.Description
	}

	var homepageURL *string
	if req.HomepageURL != "" {
		homepageURL = &req.HomepageURL
	}

	var docsURL *string
	if req.DocsURL != "" {
		docsURL = &req.DocsURL
	}

	// Create product in database
	product, err := s.queries.CreateProduct(ctx, sqlc.CreateProductParams{
		ID:           productID,
		CompanyID:    companyID,
		Name:         req.Name,
		Slug:         string(slug),
		Category:     req.Category,
		ShortTagline: shortTagline,
		Description:  description,
		HomepageUrl:  homepageURL,
		DocsUrl:      docsURL,
		AvgRating:    nil,
		TotalReviews: 0,
		CreatedAt:    now,
		UpdatedAt:    now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}

	return SQLCToDomainProduct(product)
}

// GetProductByID retrieves a product by its ID
func (s *ProductService) GetProductByID(ctx context.Context, productID string) (*domain.Product, error) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return nil, fmt.Errorf("invalid product ID format: %w", err)
	}

	product, err := s.queries.GetProduct(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("failed to get product: %w", err)
	}

	return SQLCToDomainProduct(product)
}

// GetProductBySlug retrieves a product by its slug (with company info)
func (s *ProductService) GetProductBySlug(ctx context.Context, slug string) (*domain.Product, *string, *string, error) {
	// Validate slug format
	_, err := domain.NewSlug(slug)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("invalid slug format: %w", err)
	}

	productRow, err := s.queries.GetProductBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil, nil, fmt.Errorf("product not found")
		}
		return nil, nil, nil, fmt.Errorf("failed to get product: %w", err)
	}

	product, err := SQLCToDomainProductFromSlugRow(productRow)
	if err != nil {
		return nil, nil, nil, err
	}

	return product, &productRow.CompanyName, &productRow.CompanySlug, nil
}

// ListProducts retrieves a paginated list of products
func (s *ProductService) ListProducts(ctx context.Context, limit, offset int32) ([]*domain.Product, error) {
	productRows, err := s.queries.ListProducts(ctx, sqlc.ListProductsParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to list products: %w", err)
	}

	return convertProductRowsToDomain(productRows)
}

// ListProductsByCategory retrieves products filtered by category
func (s *ProductService) ListProductsByCategory(ctx context.Context, category string, limit, offset int32) ([]*domain.Product, error) {
	// Validate category
	cat := domain.ProductCategory(category)
	if !isValidCategory(cat) {
		return nil, fmt.Errorf("invalid category: %s", category)
	}

	productRows, err := s.queries.ListProductsByCategory(ctx, sqlc.ListProductsByCategoryParams{
		Category: category,
		Limit:    limit,
		Offset:   offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to list products by category: %w", err)
	}

	return convertCategoryProductRowsToDomain(productRows)
}

// SearchProducts searches for products by name or company name
func (s *ProductService) SearchProducts(ctx context.Context, query string, limit, offset int32) ([]*domain.Product, error) {
	// Add wildcards for ILIKE search
	searchQuery := "%" + query + "%"

	productRows, err := s.queries.SearchProducts(ctx, sqlc.SearchProductsParams{
		Name:   searchQuery,
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to search products: %w", err)
	}

	return convertSearchProductRowsToDomain(productRows)
}

// GetProductsByCompany retrieves all products for a company
func (s *ProductService) GetProductsByCompany(ctx context.Context, companyID string, limit, offset int32) ([]*domain.Product, error) {
	parsedID, err := uuid.Parse(companyID)
	if err != nil {
		return nil, fmt.Errorf("invalid company ID format: %w", err)
	}

	products, err := s.queries.GetProductsByCompany(ctx, sqlc.GetProductsByCompanyParams{
		CompanyID: parsedID,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get products by company: %w", err)
	}

	// Convert to domain products
	domainProducts := make([]*domain.Product, 0, len(products))
	for _, product := range products {
		domainProduct, err := SQLCToDomainProduct(product)
		if err != nil {
			return nil, fmt.Errorf("failed to convert product: %w", err)
		}
		domainProducts = append(domainProducts, domainProduct)
	}

	return domainProducts, nil
}

// UpdateProduct updates an existing product
func (s *ProductService) UpdateProduct(ctx context.Context, productID string, req UpdateProductRequest) (*domain.Product, error) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return nil, fmt.Errorf("invalid product ID format: %w", err)
	}

	// Validate slug format
	slug, err := domain.NewSlug(req.Slug)
	if err != nil {
		return nil, fmt.Errorf("invalid slug format: %w", err)
	}

	// Validate category
	category := domain.ProductCategory(req.Category)
	if !isValidCategory(category) {
		return nil, fmt.Errorf("invalid category: %s", req.Category)
	}

	// Check if product exists
	_, err = s.queries.GetProduct(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("failed to get product: %w", err)
	}

	now := pgtype.Timestamptz{
		Time:  time.Now().UTC(),
		Valid: true,
	}

	// Prepare optional fields
	var shortTagline *string
	if req.ShortTagline != "" {
		shortTagline = &req.ShortTagline
	}

	var description *string
	if req.Description != "" {
		description = &req.Description
	}

	var homepageURL *string
	if req.HomepageURL != "" {
		homepageURL = &req.HomepageURL
	}

	var docsURL *string
	if req.DocsURL != "" {
		docsURL = &req.DocsURL
	}

	// Update product in database
	product, err := s.queries.UpdateProduct(ctx, sqlc.UpdateProductParams{
		ID:           parsedID,
		Name:         req.Name,
		Slug:         string(slug),
		Category:     req.Category,
		ShortTagline: shortTagline,
		Description:  description,
		HomepageUrl:  homepageURL,
		DocsUrl:      docsURL,
		AvgRating:    nil, // Will be recalculated by reviews
		TotalReviews: 0,   // Will be recalculated by reviews
		UpdatedAt:    now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update product: %w", err)
	}

	return SQLCToDomainProduct(product)
}

// DeleteProduct soft deletes a product
func (s *ProductService) DeleteProduct(ctx context.Context, productID string) error {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return fmt.Errorf("invalid product ID format: %w", err)
	}

	// Check if product exists
	_, err = s.queries.GetProduct(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("product not found")
		}
		return fmt.Errorf("failed to get product: %w", err)
	}

	// Soft delete the product
	err = s.queries.SoftDeleteProduct(ctx, parsedID)
	if err != nil {
		return fmt.Errorf("failed to delete product: %w", err)
	}

	return nil
}

// CountProducts returns the total number of products
func (s *ProductService) CountProducts(ctx context.Context) (int64, error) {
	count, err := s.queries.CountProducts(ctx)
	if err != nil {
		return 0, fmt.Errorf("failed to count products: %w", err)
	}
	return count, nil
}

// CountProductsByCompany returns the total number of products for a company
func (s *ProductService) CountProductsByCompany(ctx context.Context, companyID string) (int64, error) {
	parsedID, err := uuid.Parse(companyID)
	if err != nil {
		return 0, fmt.Errorf("invalid company ID format: %w", err)
	}

	count, err := s.queries.CountProductsByCompany(ctx, parsedID)
	if err != nil {
		return 0, fmt.Errorf("failed to count products by company: %w", err)
	}
	return count, nil
}

// Helper functions

func isValidCategory(cat domain.ProductCategory) bool {
	switch cat {
	case domain.CategoryHosting,
		domain.CategoryFeatureToggles,
		domain.CategoryCI,
		domain.CategoryObservability,
		domain.CategoryOther:
		return true
	default:
		return false
	}
}

func convertProductRowsToDomain(rows []sqlc.ListProductsRow) ([]*domain.Product, error) {
	domainProducts := make([]*domain.Product, 0, len(rows))
	for _, row := range rows {
		domainProduct, err := SQLCToDomainProductFromListRow(row)
		if err != nil {
			return nil, fmt.Errorf("failed to convert product: %w", err)
		}
		domainProducts = append(domainProducts, domainProduct)
	}
	return domainProducts, nil
}

func convertCategoryProductRowsToDomain(rows []sqlc.ListProductsByCategoryRow) ([]*domain.Product, error) {
	domainProducts := make([]*domain.Product, 0, len(rows))
	for _, row := range rows {
		domainProduct, err := SQLCToDomainProductFromCategoryRow(row)
		if err != nil {
			return nil, fmt.Errorf("failed to convert product: %w", err)
		}
		domainProducts = append(domainProducts, domainProduct)
	}
	return domainProducts, nil
}

func convertSearchProductRowsToDomain(rows []sqlc.SearchProductsRow) ([]*domain.Product, error) {
	domainProducts := make([]*domain.Product, 0, len(rows))
	for _, row := range rows {
		domainProduct, err := SQLCToDomainProductFromSearchRow(row)
		if err != nil {
			return nil, fmt.Errorf("failed to convert product: %w", err)
		}
		domainProducts = append(domainProducts, domainProduct)
	}
	return domainProducts, nil
}

// SQLCToDomainProduct converts a SQLC Product to a domain Product
func SQLCToDomainProduct(sqlcProduct sqlc.Product) (*domain.Product, error) {
	slug, err := domain.NewSlug(sqlcProduct.Slug)
	if err != nil {
		return nil, err
	}

	// Convert timestamps
	createdAt := time.Time{}
	if sqlcProduct.CreatedAt.Valid {
		createdAt = sqlcProduct.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if sqlcProduct.UpdatedAt.Valid {
		updatedAt = sqlcProduct.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if sqlcProduct.DeletedAt.Valid {
		deletedAt = &sqlcProduct.DeletedAt.Time
	}

	shortTagline := ""
	if sqlcProduct.ShortTagline != nil {
		shortTagline = *sqlcProduct.ShortTagline
	}

	description := ""
	if sqlcProduct.Description != nil {
		description = *sqlcProduct.Description
	}

	homepageURL := ""
	if sqlcProduct.HomepageUrl != nil {
		homepageURL = *sqlcProduct.HomepageUrl
	}

	docsURL := ""
	if sqlcProduct.DocsUrl != nil {
		docsURL = *sqlcProduct.DocsUrl
	}

	totalReviews := int(sqlcProduct.TotalReviews)

	return &domain.Product{
		ID:           sqlcProduct.ID,
		CompanyID:    sqlcProduct.CompanyID,
		Name:         sqlcProduct.Name,
		Slug:         slug,
		Category:     domain.ProductCategory(sqlcProduct.Category),
		ShortTagline: shortTagline,
		Description:  description,
		HomepageURL:  homepageURL,
		DocsURL:      docsURL,
		AvgRating:    sqlcProduct.AvgRating,
		TotalReviews: totalReviews,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}

// SQLCToDomainProductFromListRow converts a ListProductsRow to a domain Product
func SQLCToDomainProductFromListRow(row sqlc.ListProductsRow) (*domain.Product, error) {
	slug, err := domain.NewSlug(row.Slug)
	if err != nil {
		return nil, err
	}

	createdAt := time.Time{}
	if row.CreatedAt.Valid {
		createdAt = row.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if row.UpdatedAt.Valid {
		updatedAt = row.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if row.DeletedAt.Valid {
		deletedAt = &row.DeletedAt.Time
	}

	shortTagline := ""
	if row.ShortTagline != nil {
		shortTagline = *row.ShortTagline
	}

	description := ""
	if row.Description != nil {
		description = *row.Description
	}

	homepageURL := ""
	if row.HomepageUrl != nil {
		homepageURL = *row.HomepageUrl
	}

	docsURL := ""
	if row.DocsUrl != nil {
		docsURL = *row.DocsUrl
	}

	totalReviews := int(row.TotalReviews)

	return &domain.Product{
		ID:           row.ID,
		CompanyID:    row.CompanyID,
		Name:         row.Name,
		Slug:         slug,
		Category:     domain.ProductCategory(row.Category),
		ShortTagline: shortTagline,
		Description:  description,
		HomepageURL:  homepageURL,
		DocsURL:      docsURL,
		AvgRating:    row.AvgRating,
		TotalReviews: totalReviews,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}

// SQLCToDomainProductFromSlugRow converts a GetProductBySlugRow to a domain Product
func SQLCToDomainProductFromSlugRow(row sqlc.GetProductBySlugRow) (*domain.Product, error) {
	slug, err := domain.NewSlug(row.Slug)
	if err != nil {
		return nil, err
	}

	createdAt := time.Time{}
	if row.CreatedAt.Valid {
		createdAt = row.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if row.UpdatedAt.Valid {
		updatedAt = row.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if row.DeletedAt.Valid {
		deletedAt = &row.DeletedAt.Time
	}

	shortTagline := ""
	if row.ShortTagline != nil {
		shortTagline = *row.ShortTagline
	}

	description := ""
	if row.Description != nil {
		description = *row.Description
	}

	homepageURL := ""
	if row.HomepageUrl != nil {
		homepageURL = *row.HomepageUrl
	}

	docsURL := ""
	if row.DocsUrl != nil {
		docsURL = *row.DocsUrl
	}

	totalReviews := int(row.TotalReviews)

	return &domain.Product{
		ID:           row.ID,
		CompanyID:    row.CompanyID,
		Name:         row.Name,
		Slug:         slug,
		Category:     domain.ProductCategory(row.Category),
		ShortTagline: shortTagline,
		Description:  description,
		HomepageURL:  homepageURL,
		DocsURL:      docsURL,
		AvgRating:    row.AvgRating,
		TotalReviews: totalReviews,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}

// SQLCToDomainProductFromCategoryRow converts a ListProductsByCategoryRow to a domain Product
func SQLCToDomainProductFromCategoryRow(row sqlc.ListProductsByCategoryRow) (*domain.Product, error) {
	slug, err := domain.NewSlug(row.Slug)
	if err != nil {
		return nil, err
	}

	createdAt := time.Time{}
	if row.CreatedAt.Valid {
		createdAt = row.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if row.UpdatedAt.Valid {
		updatedAt = row.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if row.DeletedAt.Valid {
		deletedAt = &row.DeletedAt.Time
	}

	shortTagline := ""
	if row.ShortTagline != nil {
		shortTagline = *row.ShortTagline
	}

	description := ""
	if row.Description != nil {
		description = *row.Description
	}

	homepageURL := ""
	if row.HomepageUrl != nil {
		homepageURL = *row.HomepageUrl
	}

	docsURL := ""
	if row.DocsUrl != nil {
		docsURL = *row.DocsUrl
	}

	totalReviews := int(row.TotalReviews)

	return &domain.Product{
		ID:           row.ID,
		CompanyID:    row.CompanyID,
		Name:         row.Name,
		Slug:         slug,
		Category:     domain.ProductCategory(row.Category),
		ShortTagline: shortTagline,
		Description:  description,
		HomepageURL:  homepageURL,
		DocsURL:      docsURL,
		AvgRating:    row.AvgRating,
		TotalReviews: totalReviews,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}

// SQLCToDomainProductFromSearchRow converts a SearchProductsRow to a domain Product
func SQLCToDomainProductFromSearchRow(row sqlc.SearchProductsRow) (*domain.Product, error) {
	slug, err := domain.NewSlug(row.Slug)
	if err != nil {
		return nil, err
	}

	createdAt := time.Time{}
	if row.CreatedAt.Valid {
		createdAt = row.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if row.UpdatedAt.Valid {
		updatedAt = row.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if row.DeletedAt.Valid {
		deletedAt = &row.DeletedAt.Time
	}

	shortTagline := ""
	if row.ShortTagline != nil {
		shortTagline = *row.ShortTagline
	}

	description := ""
	if row.Description != nil {
		description = *row.Description
	}

	homepageURL := ""
	if row.HomepageUrl != nil {
		homepageURL = *row.HomepageUrl
	}

	docsURL := ""
	if row.DocsUrl != nil {
		docsURL = *row.DocsUrl
	}

	totalReviews := int(row.TotalReviews)

	return &domain.Product{
		ID:           row.ID,
		CompanyID:    row.CompanyID,
		Name:         row.Name,
		Slug:         slug,
		Category:     domain.ProductCategory(row.Category),
		ShortTagline: shortTagline,
		Description:  description,
		HomepageURL:  homepageURL,
		DocsURL:      docsURL,
		AvgRating:    row.AvgRating,
		TotalReviews: totalReviews,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}
