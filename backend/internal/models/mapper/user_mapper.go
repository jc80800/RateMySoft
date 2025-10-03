package mapper

import (
	"ratemysoft-backend/internal/domain"
	"ratemysoft-backend/internal/models"
)

// UserDomainToModel converts a domain User to a UserModel
func UserDomainToModel(user *domain.User) *models.UserModel {
	return &models.UserModel{
		ID:        user.ID.String(),
		Email:     string(user.Email),
		Handle:    user.Handle,
		Role:      string(user.Role),
		TenantID:  StringPtr(user.TenantID.String()),
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		DeletedAt: user.DeletedAt,
	}
}

// UserModelToDomain converts a UserModel to a domain User
func UserModelToDomain(model *models.UserModel) (*domain.User, error) {
	id, err := domain.ParseID(model.ID)
	if err != nil {
		return nil, err
	}

	email, err := domain.NewEmail(model.Email)
	if err != nil {
		return nil, err
	}

	var tenantID *domain.ID
	if model.TenantID != nil {
		tid, err := domain.ParseID(*model.TenantID)
		if err != nil {
			return nil, err
		}
		tenantID = &tid
	}

	return &domain.User{
		ID:        id,
		Email:     email,
		Handle:    model.Handle,
		Role:      domain.UserRole(model.Role),
		TenantID:  tenantID,
		CreatedAt: model.CreatedAt,
		UpdatedAt: model.UpdatedAt,
		DeletedAt: model.DeletedAt,
	}, nil
}
