package mapper

import (
	"ratemysoft-backend/internal/domain"
	"ratemysoft-backend/internal/models"
)

// CompanyDomainToModel converts a domain Company to a CompanyModel
func CompanyDomainToModel(company *domain.Company) *models.CompanyModel {
	return &models.CompanyModel{
		ID:        company.ID.String(),
		Name:      company.Name,
		Website:   StringPtr(company.Website),
		Slug:      string(company.Slug),
		LogoURL:   StringPtr(company.LogoURL),
		CreatedAt: company.CreatedAt,
		UpdatedAt: company.UpdatedAt,
		DeletedAt: company.DeletedAt,
	}
}

// CompanyModelToDomain converts a CompanyModel to a domain Company
func CompanyModelToDomain(model *models.CompanyModel) (*domain.Company, error) {
	id, err := domain.ParseID(model.ID)
	if err != nil {
		return nil, err
	}

	slug, err := domain.NewSlug(model.Slug)
	if err != nil {
		return nil, err
	}

	return &domain.Company{
		ID:        id,
		Name:      model.Name,
		Website:   StringValue(model.Website),
		Slug:      slug,
		LogoURL:   StringValue(model.LogoURL),
		CreatedAt: model.CreatedAt,
		UpdatedAt: model.UpdatedAt,
		DeletedAt: model.DeletedAt,
	}, nil
}
