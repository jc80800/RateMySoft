package mapper

import (
	"ratemysoft-backend/internal/domain"
	"ratemysoft-backend/internal/models"
)

// ProductDomainToModel converts a domain Product to a ProductModel
func ProductDomainToModel(product *domain.Product) *models.ProductModel {
	return &models.ProductModel{
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
	}
}

// ProductModelToDomain converts a ProductModel to a domain Product
func ProductModelToDomain(model *models.ProductModel) (*domain.Product, error) {
	id, err := domain.ParseID(model.ID)
	if err != nil {
		return nil, err
	}

	companyID, err := domain.ParseID(model.CompanyID)
	if err != nil {
		return nil, err
	}

	slug, err := domain.NewSlug(model.Slug)
	if err != nil {
		return nil, err
	}

	return &domain.Product{
		ID:           id,
		CompanyID:    companyID,
		Name:         model.Name,
		Slug:         slug,
		Category:     domain.ProductCategory(model.Category),
		ShortTagline: model.ShortTagline,
		Description:  model.Description,
		HomepageURL:  model.HomepageURL,
		DocsURL:      model.DocsURL,
		AvgRating:    model.AvgRating,
		TotalReviews: model.TotalReviews,
		CreatedAt:    model.CreatedAt,
		UpdatedAt:    model.UpdatedAt,
		DeletedAt:    model.DeletedAt,
	}, nil
}
