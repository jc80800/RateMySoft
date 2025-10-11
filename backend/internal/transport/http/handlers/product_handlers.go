package handlers

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"ratemysoft-backend/internal/services"
	"ratemysoft-backend/internal/transport/http/dto"

	"github.com/labstack/echo/v4"
)

// CreateProduct creates a new product
func (h *Handler) CreateProduct(c echo.Context) error {
	var req dto.CreateProductRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error":   "Validation failed",
			"details": err.Error(),
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	product, err := h.productService.CreateProduct(ctx, services.CreateProductRequest{
		CompanyID:    req.CompanyID,
		Name:         strings.TrimSpace(req.Name),
		Slug:         strings.TrimSpace(req.Slug),
		Category:     req.Category,
		ShortTagline: strings.TrimSpace(req.ShortTagline),
		Description:  strings.TrimSpace(req.Description),
		HomepageURL:  strings.TrimSpace(req.HomepageURL),
		DocsURL:      strings.TrimSpace(req.DocsURL),
	})
	if err != nil {
		if strings.Contains(err.Error(), "company not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Company not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to create product",
			"details": err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, dto.ProductResponse{
		ID:           product.ID.String(),
		CompanyID:    product.CompanyID.String(),
		Name:         product.Name,
		Slug:         string(product.Slug),
		Category:     string(product.Category),
		ShortTagline: product.ShortTagline,
		Description:  product.Description,
		HomepageURL:  product.HomepageURL,
		DocsURL:      product.DocsURL,
		AvgRating:    product.AvgRating,
		TotalReviews: product.TotalReviews,
		CreatedAt:    product.CreatedAt,
		UpdatedAt:    product.UpdatedAt,
		DeletedAt:    product.DeletedAt,
	})
}

// GetProduct retrieves a product by ID
func (h *Handler) GetProduct(c echo.Context) error {
	productID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	product, err := h.productService.GetProductByID(ctx, productID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Product not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid product ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get product",
		})
	}

	return c.JSON(http.StatusOK, dto.ProductResponse{
		ID:           product.ID.String(),
		CompanyID:    product.CompanyID.String(),
		Name:         product.Name,
		Slug:         string(product.Slug),
		Category:     string(product.Category),
		ShortTagline: product.ShortTagline,
		Description:  product.Description,
		HomepageURL:  product.HomepageURL,
		DocsURL:      product.DocsURL,
		AvgRating:    product.AvgRating,
		TotalReviews: product.TotalReviews,
		CreatedAt:    product.CreatedAt,
		UpdatedAt:    product.UpdatedAt,
		DeletedAt:    product.DeletedAt,
	})
}

// GetProductBySlug retrieves a product by slug
func (h *Handler) GetProductBySlug(c echo.Context) error {
	slug := c.Param("slug")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	product, companyName, companySlug, err := h.productService.GetProductBySlug(ctx, slug)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Product not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid slug format",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get product",
		})
	}

	response := dto.ProductWithCompanyResponse{
		ProductResponse: dto.ProductResponse{
			ID:           product.ID.String(),
			CompanyID:    product.CompanyID.String(),
			Name:         product.Name,
			Slug:         string(product.Slug),
			Category:     string(product.Category),
			ShortTagline: product.ShortTagline,
			Description:  product.Description,
			HomepageURL:  product.HomepageURL,
			DocsURL:      product.DocsURL,
			AvgRating:    product.AvgRating,
			TotalReviews: product.TotalReviews,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
			DeletedAt:    product.DeletedAt,
		},
	}

	if companyName != nil {
		response.CompanyName = *companyName
	}
	if companySlug != nil {
		response.CompanySlug = *companySlug
	}

	return c.JSON(http.StatusOK, response)
}

// ListProducts retrieves a paginated list of products
func (h *Handler) ListProducts(c echo.Context) error {
	// Parse pagination parameters
	limit := int32(50) // default
	if l := c.QueryParam("limit"); l != "" {
		if parsed, err := strconv.ParseInt(l, 10, 32); err == nil && parsed > 0 {
			limit = int32(parsed)
			if limit > 100 {
				limit = 100 // max limit
			}
		}
	}

	offset := int32(0) // default
	if o := c.QueryParam("offset"); o != "" {
		if parsed, err := strconv.ParseInt(o, 10, 32); err == nil && parsed >= 0 {
			offset = int32(parsed)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get total count
	total, err := h.productService.CountProducts(ctx)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to count products",
		})
	}

	// Get products
	products, err := h.productService.ListProducts(ctx, limit, offset)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to list products",
		})
	}

	// Convert to response DTOs
	productResponses := make([]dto.ProductResponse, 0, len(products))
	for _, product := range products {
		productResponses = append(productResponses, dto.ProductResponse{
			ID:           product.ID.String(),
			CompanyID:    product.CompanyID.String(),
			Name:         product.Name,
			Slug:         string(product.Slug),
			Category:     string(product.Category),
			ShortTagline: product.ShortTagline,
			Description:  product.Description,
			HomepageURL:  product.HomepageURL,
			DocsURL:      product.DocsURL,
			AvgRating:    product.AvgRating,
			TotalReviews: product.TotalReviews,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
			DeletedAt:    product.DeletedAt,
		})
	}

	return c.JSON(http.StatusOK, dto.ProductListResponse{
		Products: productResponses,
		Total:    total,
		Limit:    limit,
		Offset:   offset,
	})
}

// ListProductsByCategory retrieves products filtered by category
func (h *Handler) ListProductsByCategory(c echo.Context) error {
	category := c.Param("category")

	// Parse pagination parameters
	limit := int32(50) // default
	if l := c.QueryParam("limit"); l != "" {
		if parsed, err := strconv.ParseInt(l, 10, 32); err == nil && parsed > 0 {
			limit = int32(parsed)
			if limit > 100 {
				limit = 100 // max limit
			}
		}
	}

	offset := int32(0) // default
	if o := c.QueryParam("offset"); o != "" {
		if parsed, err := strconv.ParseInt(o, 10, 32); err == nil && parsed >= 0 {
			offset = int32(parsed)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	products, err := h.productService.ListProductsByCategory(ctx, category, limit, offset)
	if err != nil {
		if strings.Contains(err.Error(), "invalid category") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid category. Valid categories: hosting, feature_toggles, ci_cd, observability, other",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to list products by category",
		})
	}

	// Convert to response DTOs
	productResponses := make([]dto.ProductResponse, 0, len(products))
	for _, product := range products {
		productResponses = append(productResponses, dto.ProductResponse{
			ID:           product.ID.String(),
			CompanyID:    product.CompanyID.String(),
			Name:         product.Name,
			Slug:         string(product.Slug),
			Category:     string(product.Category),
			ShortTagline: product.ShortTagline,
			Description:  product.Description,
			HomepageURL:  product.HomepageURL,
			DocsURL:      product.DocsURL,
			AvgRating:    product.AvgRating,
			TotalReviews: product.TotalReviews,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
			DeletedAt:    product.DeletedAt,
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"products": productResponses,
		"category": category,
		"count":    len(productResponses),
		"limit":    limit,
		"offset":   offset,
	})
}

// SearchProducts searches for products by name or company name
func (h *Handler) SearchProducts(c echo.Context) error {
	query := c.QueryParam("q")
	if query == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Search query parameter 'q' is required",
		})
	}

	// Parse pagination parameters
	limit := int32(50) // default
	if l := c.QueryParam("limit"); l != "" {
		if parsed, err := strconv.ParseInt(l, 10, 32); err == nil && parsed > 0 {
			limit = int32(parsed)
			if limit > 100 {
				limit = 100 // max limit
			}
		}
	}

	offset := int32(0) // default
	if o := c.QueryParam("offset"); o != "" {
		if parsed, err := strconv.ParseInt(o, 10, 32); err == nil && parsed >= 0 {
			offset = int32(parsed)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	products, err := h.productService.SearchProducts(ctx, query, limit, offset)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to search products",
		})
	}

	// Convert to response DTOs
	productResponses := make([]dto.ProductResponse, 0, len(products))
	for _, product := range products {
		productResponses = append(productResponses, dto.ProductResponse{
			ID:           product.ID.String(),
			CompanyID:    product.CompanyID.String(),
			Name:         product.Name,
			Slug:         string(product.Slug),
			Category:     string(product.Category),
			ShortTagline: product.ShortTagline,
			Description:  product.Description,
			HomepageURL:  product.HomepageURL,
			DocsURL:      product.DocsURL,
			AvgRating:    product.AvgRating,
			TotalReviews: product.TotalReviews,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
			DeletedAt:    product.DeletedAt,
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"products": productResponses,
		"count":    len(productResponses),
		"limit":    limit,
		"offset":   offset,
	})
}

// GetProductsByCompany retrieves all products for a company
func (h *Handler) GetProductsByCompany(c echo.Context) error {
	companyID := c.Param("companyId")

	// Parse pagination parameters
	limit := int32(50) // default
	if l := c.QueryParam("limit"); l != "" {
		if parsed, err := strconv.ParseInt(l, 10, 32); err == nil && parsed > 0 {
			limit = int32(parsed)
			if limit > 100 {
				limit = 100 // max limit
			}
		}
	}

	offset := int32(0) // default
	if o := c.QueryParam("offset"); o != "" {
		if parsed, err := strconv.ParseInt(o, 10, 32); err == nil && parsed >= 0 {
			offset = int32(parsed)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	products, err := h.productService.GetProductsByCompany(ctx, companyID, limit, offset)
	if err != nil {
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid company ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get products by company",
		})
	}

	// Convert to response DTOs
	productResponses := make([]dto.ProductResponse, 0, len(products))
	for _, product := range products {
		productResponses = append(productResponses, dto.ProductResponse{
			ID:           product.ID.String(),
			CompanyID:    product.CompanyID.String(),
			Name:         product.Name,
			Slug:         string(product.Slug),
			Category:     string(product.Category),
			ShortTagline: product.ShortTagline,
			Description:  product.Description,
			HomepageURL:  product.HomepageURL,
			DocsURL:      product.DocsURL,
			AvgRating:    product.AvgRating,
			TotalReviews: product.TotalReviews,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
			DeletedAt:    product.DeletedAt,
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"products": productResponses,
		"count":    len(productResponses),
		"limit":    limit,
		"offset":   offset,
	})
}

// UpdateProduct updates an existing product
func (h *Handler) UpdateProduct(c echo.Context) error {
	productID := c.Param("id")

	var req dto.UpdateProductRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error":   "Validation failed",
			"details": err.Error(),
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	product, err := h.productService.UpdateProduct(ctx, productID, services.UpdateProductRequest{
		Name:         strings.TrimSpace(req.Name),
		Slug:         strings.TrimSpace(req.Slug),
		Category:     req.Category,
		ShortTagline: strings.TrimSpace(req.ShortTagline),
		Description:  strings.TrimSpace(req.Description),
		HomepageURL:  strings.TrimSpace(req.HomepageURL),
		DocsURL:      strings.TrimSpace(req.DocsURL),
	})
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Product not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to update product",
			"details": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ProductResponse{
		ID:           product.ID.String(),
		CompanyID:    product.CompanyID.String(),
		Name:         product.Name,
		Slug:         string(product.Slug),
		Category:     string(product.Category),
		ShortTagline: product.ShortTagline,
		Description:  product.Description,
		HomepageURL:  product.HomepageURL,
		DocsURL:      product.DocsURL,
		AvgRating:    product.AvgRating,
		TotalReviews: product.TotalReviews,
		CreatedAt:    product.CreatedAt,
		UpdatedAt:    product.UpdatedAt,
		DeletedAt:    product.DeletedAt,
	})
}

// DeleteProduct soft deletes a product
func (h *Handler) DeleteProduct(c echo.Context) error {
	productID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := h.productService.DeleteProduct(ctx, productID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Product not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid product ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to delete product",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Product deleted successfully",
	})
}
