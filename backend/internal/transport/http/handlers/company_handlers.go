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

// CreateCompany creates a new company
func (h *Handler) CreateCompany(c echo.Context) error {
	var req dto.CreateCompanyRequest

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

	company, err := h.companyService.CreateCompany(ctx, services.CreateCompanyRequest{
		Name:    strings.TrimSpace(req.Name),
		Website: strings.TrimSpace(req.Website),
		Slug:    strings.TrimSpace(req.Slug),
		LogoURL: strings.TrimSpace(req.LogoURL),
	})
	if err != nil {
		if strings.Contains(err.Error(), "already exists") {
			return c.JSON(http.StatusConflict, map[string]string{
				"error": err.Error(),
			})
		}
		if strings.Contains(err.Error(), "invalid slug") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to create company",
			"details": err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, dto.CompanyResponse{
		ID:        company.ID.String(),
		Name:      company.Name,
		Website:   company.Website,
		Slug:      string(company.Slug),
		LogoURL:   company.LogoURL,
		CreatedAt: company.CreatedAt,
		UpdatedAt: company.UpdatedAt,
		DeletedAt: company.DeletedAt,
	})
}

// GetCompany retrieves a company by ID
func (h *Handler) GetCompany(c echo.Context) error {
	companyID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	company, err := h.companyService.GetCompanyByID(ctx, companyID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Company not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid company ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get company",
		})
	}

	return c.JSON(http.StatusOK, dto.CompanyResponse{
		ID:        company.ID.String(),
		Name:      company.Name,
		Website:   company.Website,
		Slug:      string(company.Slug),
		LogoURL:   company.LogoURL,
		CreatedAt: company.CreatedAt,
		UpdatedAt: company.UpdatedAt,
		DeletedAt: company.DeletedAt,
	})
}

// GetCompanyBySlug retrieves a company by slug
func (h *Handler) GetCompanyBySlug(c echo.Context) error {
	slug := c.Param("slug")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	company, err := h.companyService.GetCompanyBySlug(ctx, slug)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Company not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid slug format",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get company",
		})
	}

	return c.JSON(http.StatusOK, dto.CompanyResponse{
		ID:        company.ID.String(),
		Name:      company.Name,
		Website:   company.Website,
		Slug:      string(company.Slug),
		LogoURL:   company.LogoURL,
		CreatedAt: company.CreatedAt,
		UpdatedAt: company.UpdatedAt,
		DeletedAt: company.DeletedAt,
	})
}

// ListCompanies retrieves a paginated list of companies
func (h *Handler) ListCompanies(c echo.Context) error {
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
	total, err := h.companyService.CountCompanies(ctx)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to count companies",
		})
	}

	// Get companies
	companies, err := h.companyService.ListCompanies(ctx, limit, offset)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to list companies",
		})
	}

	// Convert to response DTOs
	companyResponses := make([]dto.CompanyResponse, 0, len(companies))
	for _, company := range companies {
		companyResponses = append(companyResponses, dto.CompanyResponse{
			ID:        company.ID.String(),
			Name:      company.Name,
			Website:   company.Website,
			Slug:      string(company.Slug),
			LogoURL:   company.LogoURL,
			CreatedAt: company.CreatedAt,
			UpdatedAt: company.UpdatedAt,
			DeletedAt: company.DeletedAt,
		})
	}

	return c.JSON(http.StatusOK, dto.CompanyListResponse{
		Companies: companyResponses,
		Total:     total,
		Limit:     limit,
		Offset:    offset,
	})
}

// SearchCompanies searches for companies by name or slug
func (h *Handler) SearchCompanies(c echo.Context) error {
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

	companies, err := h.companyService.SearchCompanies(ctx, query, limit, offset)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to search companies",
		})
	}

	// Convert to response DTOs
	companyResponses := make([]dto.CompanyResponse, 0, len(companies))
	for _, company := range companies {
		companyResponses = append(companyResponses, dto.CompanyResponse{
			ID:        company.ID.String(),
			Name:      company.Name,
			Website:   company.Website,
			Slug:      string(company.Slug),
			LogoURL:   company.LogoURL,
			CreatedAt: company.CreatedAt,
			UpdatedAt: company.UpdatedAt,
			DeletedAt: company.DeletedAt,
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"companies": companyResponses,
		"count":     len(companyResponses),
		"limit":     limit,
		"offset":    offset,
	})
}

// UpdateCompany updates an existing company
func (h *Handler) UpdateCompany(c echo.Context) error {
	companyID := c.Param("id")

	var req dto.UpdateCompanyRequest
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

	company, err := h.companyService.UpdateCompany(ctx, companyID, services.UpdateCompanyRequest{
		Name:    strings.TrimSpace(req.Name),
		Website: strings.TrimSpace(req.Website),
		Slug:    strings.TrimSpace(req.Slug),
		LogoURL: strings.TrimSpace(req.LogoURL),
	})
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Company not found",
			})
		}
		if strings.Contains(err.Error(), "already exists") {
			return c.JSON(http.StatusConflict, map[string]string{
				"error": err.Error(),
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to update company",
			"details": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.CompanyResponse{
		ID:        company.ID.String(),
		Name:      company.Name,
		Website:   company.Website,
		Slug:      string(company.Slug),
		LogoURL:   company.LogoURL,
		CreatedAt: company.CreatedAt,
		UpdatedAt: company.UpdatedAt,
		DeletedAt: company.DeletedAt,
	})
}

// DeleteCompany soft deletes a company
func (h *Handler) DeleteCompany(c echo.Context) error {
	companyID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := h.companyService.DeleteCompany(ctx, companyID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Company not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid company ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to delete company",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Company deleted successfully",
	})
}
