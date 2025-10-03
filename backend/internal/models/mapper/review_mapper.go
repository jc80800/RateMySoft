package mapper

import (
	"ratemysoft-backend/internal/domain"
	"ratemysoft-backend/internal/models"
)

// ReviewDomainToModel converts a domain Review to a ReviewModel
func ReviewDomainToModel(review *domain.Review) *models.ReviewModel {
	return &models.ReviewModel{
		ID:           review.ID.String(),
		ProductID:    review.ProductID.String(),
		UserID:       review.UserID.String(),
		Title:        review.Title,
		Body:         review.Body,
		Rating:       int(review.Rating),
		Status:       string(review.Status),
		HelpfulCount: review.HelpfulCount,
		FlagCount:    review.FlagCount,
		Edited:       review.Edited,
		CreatedAt:    review.CreatedAt,
		UpdatedAt:    review.UpdatedAt,
		DeletedAt:    review.DeletedAt,
	}
}

// ReviewModelToDomain converts a ReviewModel to a domain Review
func ReviewModelToDomain(model *models.ReviewModel) (*domain.Review, error) {
	id, err := domain.ParseID(model.ID)
	if err != nil {
		return nil, err
	}

	productID, err := domain.ParseID(model.ProductID)
	if err != nil {
		return nil, err
	}

	userID, err := domain.ParseID(model.UserID)
	if err != nil {
		return nil, err
	}

	rating, err := domain.NewRating(model.Rating)
	if err != nil {
		return nil, err
	}

	return &domain.Review{
		ID:           id,
		ProductID:    productID,
		UserID:       userID,
		Title:        model.Title,
		Body:         model.Body,
		Rating:       rating,
		Status:       domain.ReviewStatus(model.Status),
		HelpfulCount: model.HelpfulCount,
		FlagCount:    model.FlagCount,
		Edited:       model.Edited,
		CreatedAt:    model.CreatedAt,
		UpdatedAt:    model.UpdatedAt,
		DeletedAt:    model.DeletedAt,
	}, nil
}
