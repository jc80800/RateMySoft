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

// ReviewService handles review-related business logic
type ReviewService struct {
	queries *sqlc.Queries
}

func NewReviewService(queries *sqlc.Queries) *ReviewService {
	return &ReviewService{
		queries: queries,
	}
}

type CreateReviewRequest struct {
	ProductID string
	UserID    string
	Title     string
	Body      string
	Rating    int
}

type UpdateReviewRequest struct {
	Title  string
	Body   string
	Rating int
}

// CreateReview creates a new review and updates product stats
func (s *ReviewService) CreateReview(ctx context.Context, req CreateReviewRequest) (*domain.Review, error) {
	// Validate product ID
	productID, err := uuid.Parse(req.ProductID)
	if err != nil {
		return nil, fmt.Errorf("invalid product ID format: %w", err)
	}

	// Validate user ID
	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	// Check if product exists
	_, err = s.queries.GetProduct(ctx, productID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("failed to check product: %w", err)
	}

	// Check if user exists
	_, err = s.queries.GetUser(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to check user: %w", err)
	}

	// Check if user already reviewed this product
	_, err = s.queries.GetUserReviewForProduct(ctx, sqlc.GetUserReviewForProductParams{
		ProductID: productID,
		UserID:    userID,
	})
	if err == nil {
		return nil, fmt.Errorf("you have already reviewed this product")
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to check existing review: %w", err)
	}

	// Validate rating
	rating, err := domain.NewRating(req.Rating)
	if err != nil {
		return nil, fmt.Errorf("invalid rating: must be between 1 and 5")
	}

	reviewID := uuid.New()
	now := pgtype.Timestamptz{
		Time:  time.Now().UTC(),
		Valid: true,
	}

	// Prepare optional fields
	var title *string
	if req.Title != "" {
		title = &req.Title
	}

	// Create review in database
	review, err := s.queries.CreateReview(ctx, sqlc.CreateReviewParams{
		ID:            reviewID,
		ProductID:     productID,
		UserID:        userID,
		Title:         title,
		Body:          req.Body,
		Rating:        int32(rating),
		Status:        string(domain.ReviewPublished), // Auto-publish for MVP
		UpvoteCount:   0,
		DownvoteCount: 0,
		FlagCount:     0,
		Edited:        false,
		CreatedAt:     now,
		UpdatedAt:     now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create review: %w", err)
	}

	// Update product stats (average rating and total reviews)
	err = s.updateProductStats(ctx, productID)
	if err != nil {
		// Log error but don't fail the review creation
		fmt.Printf("Warning: failed to update product stats: %v\n", err)
	}

	return SQLCToDomainReview(review)
}

// GetReviewByID retrieves a review by its ID
func (s *ReviewService) GetReviewByID(ctx context.Context, reviewID string) (*domain.Review, error) {
	parsedID, err := uuid.Parse(reviewID)
	if err != nil {
		return nil, fmt.Errorf("invalid review ID format: %w", err)
	}

	reviewRow, err := s.queries.GetReview(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("review not found")
		}
		return nil, fmt.Errorf("failed to get review: %w", err)
	}

	return SQLCToDomainReviewFromGetReviewRow(reviewRow)
}

// GetReviewsByProduct retrieves reviews for a product
func (s *ReviewService) GetReviewsByProduct(ctx context.Context, productID string, sortBy string, limit, offset int32) ([]*domain.Review, error) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return nil, fmt.Errorf("invalid product ID format: %w", err)
	}

	// Validate sort parameter
	validSorts := map[string]bool{
		"upvotes":     true,
		"rating_desc": true,
		"rating_asc":  true,
		"recent":      true,
	}
	if sortBy == "" {
		sortBy = "recent"
	}
	if !validSorts[sortBy] {
		sortBy = "recent"
	}

	reviewRows, err := s.queries.GetReviewsByProduct(ctx, sqlc.GetReviewsByProductParams{
		ProductID: parsedID,
		Column2:   sortBy,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get reviews by product: %w", err)
	}

	return convertReviewRowsToDomain(reviewRows)
}

// GetReviewsByUser retrieves all reviews by a user
func (s *ReviewService) GetReviewsByUser(ctx context.Context, userID string, limit, offset int32) ([]*domain.Review, error) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	reviewRows, err := s.queries.GetReviewsByUser(ctx, sqlc.GetReviewsByUserParams{
		UserID: parsedID,
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get reviews by user: %w", err)
	}

	return convertUserReviewRowsToDomain(reviewRows)
}

// UpdateReview updates an existing review
func (s *ReviewService) UpdateReview(ctx context.Context, reviewID, userID string, req UpdateReviewRequest) (*domain.Review, error) {
	parsedReviewID, err := uuid.Parse(reviewID)
	if err != nil {
		return nil, fmt.Errorf("invalid review ID format: %w", err)
	}

	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %w", err)
	}

	// Check if review exists and belongs to user
	existingReviewRow, err := s.queries.GetReview(ctx, parsedReviewID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("review not found")
		}
		return nil, fmt.Errorf("failed to get review: %w", err)
	}

	existingReview, err := SQLCToDomainReviewFromGetReviewRow(existingReviewRow)
	if err != nil {
		return nil, fmt.Errorf("failed to convert review: %w", err)
	}

	// Verify ownership
	if existingReview.UserID.String() != parsedUserID.String() {
		return nil, fmt.Errorf("unauthorized: you can only edit your own reviews")
	}

	// Validate rating
	rating, err := domain.NewRating(req.Rating)
	if err != nil {
		return nil, fmt.Errorf("invalid rating: must be between 1 and 5")
	}

	now := pgtype.Timestamptz{
		Time:  time.Now().UTC(),
		Valid: true,
	}

	// Prepare optional fields
	var title *string
	if req.Title != "" {
		title = &req.Title
	}

	// Update review in database
	review, err := s.queries.UpdateReview(ctx, sqlc.UpdateReviewParams{
		ID:        parsedReviewID,
		Title:     title,
		Body:      req.Body,
		Rating:    int32(rating),
		Status:    string(existingReview.Status), // Keep existing status
		Edited:    true,                          // Mark as edited
		UpdatedAt: now,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update review: %w", err)
	}

	// Update product stats if rating changed
	if int(rating) != int(existingReview.Rating) {
		err = s.updateProductStats(ctx, existingReview.ProductID)
		if err != nil {
			fmt.Printf("Warning: failed to update product stats: %v\n", err)
		}
	}

	return SQLCToDomainReview(review)
}

// DeleteReview soft deletes a review
func (s *ReviewService) DeleteReview(ctx context.Context, reviewID, userID string) error {
	parsedReviewID, err := uuid.Parse(reviewID)
	if err != nil {
		return fmt.Errorf("invalid review ID format: %w", err)
	}

	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID format: %w", err)
	}

	// Check if review exists and belongs to user
	existingReviewRow, err := s.queries.GetReview(ctx, parsedReviewID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("review not found")
		}
		return fmt.Errorf("failed to get review: %w", err)
	}

	existingReview, err := SQLCToDomainReviewFromGetReviewRow(existingReviewRow)
	if err != nil {
		return fmt.Errorf("failed to convert review: %w", err)
	}

	// Verify ownership
	if existingReview.UserID.String() != parsedUserID.String() {
		return fmt.Errorf("unauthorized: you can only delete your own reviews")
	}

	// Soft delete the review
	err = s.queries.SoftDeleteReview(ctx, parsedReviewID)
	if err != nil {
		return fmt.Errorf("failed to delete review: %w", err)
	}

	// Update product stats
	err = s.updateProductStats(ctx, existingReview.ProductID)
	if err != nil {
		fmt.Printf("Warning: failed to update product stats: %v\n", err)
	}

	return nil
}

// IncrementUpvote increments the upvote count for a review
func (s *ReviewService) IncrementUpvote(ctx context.Context, reviewID string) error {
	parsedID, err := uuid.Parse(reviewID)
	if err != nil {
		return fmt.Errorf("invalid review ID format: %w", err)
	}

	// Check if review exists
	_, err = s.queries.GetReview(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("review not found")
		}
		return fmt.Errorf("failed to get review: %w", err)
	}

	err = s.queries.IncrementUpvoteCount(ctx, parsedID)
	if err != nil {
		return fmt.Errorf("failed to increment upvote: %w", err)
	}

	return nil
}

// IncrementDownvote increments the downvote count for a review
func (s *ReviewService) IncrementDownvote(ctx context.Context, reviewID string) error {
	parsedID, err := uuid.Parse(reviewID)
	if err != nil {
		return fmt.Errorf("invalid review ID format: %w", err)
	}

	// Check if review exists
	_, err = s.queries.GetReview(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("review not found")
		}
		return fmt.Errorf("failed to get review: %w", err)
	}

	err = s.queries.IncrementDownvoteCount(ctx, parsedID)
	if err != nil {
		return fmt.Errorf("failed to increment downvote: %w", err)
	}

	return nil
}

// IncrementFlag increments the flag count for a review
func (s *ReviewService) IncrementFlag(ctx context.Context, reviewID string) error {
	parsedID, err := uuid.Parse(reviewID)
	if err != nil {
		return fmt.Errorf("invalid review ID format: %w", err)
	}

	// Check if review exists
	_, err = s.queries.GetReview(ctx, parsedID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("review not found")
		}
		return fmt.Errorf("failed to get review: %w", err)
	}

	err = s.queries.IncrementFlagCount(ctx, parsedID)
	if err != nil {
		return fmt.Errorf("failed to increment flag: %w", err)
	}

	return nil
}

// CountReviewsByProduct returns the total number of published reviews for a product
func (s *ReviewService) CountReviewsByProduct(ctx context.Context, productID string) (int64, error) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return 0, fmt.Errorf("invalid product ID format: %w", err)
	}

	count, err := s.queries.CountReviewsByProduct(ctx, parsedID)
	if err != nil {
		return 0, fmt.Errorf("failed to count reviews: %w", err)
	}
	return count, nil
}

// CountReviewsByUser returns the total number of reviews by a user
func (s *ReviewService) CountReviewsByUser(ctx context.Context, userID string) (int64, error) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return 0, fmt.Errorf("invalid user ID format: %w", err)
	}

	count, err := s.queries.CountReviewsByUser(ctx, parsedID)
	if err != nil {
		return 0, fmt.Errorf("failed to count reviews: %w", err)
	}
	return count, nil
}

// updateProductStats recalculates and updates product average rating and total reviews
func (s *ReviewService) updateProductStats(ctx context.Context, productID uuid.UUID) error {
	// Get average rating
	avgRatingResult, err := s.queries.GetAverageRatingByProduct(ctx, productID)
	if err != nil {
		return fmt.Errorf("failed to get average rating: %w", err)
	}

	// Get total count of published reviews
	totalReviews, err := s.queries.CountReviewsByProduct(ctx, productID)
	if err != nil {
		return fmt.Errorf("failed to count reviews: %w", err)
	}

	// Convert avgRatingResult to *float64
	var avgRating *float64
	if avgRatingResult.Valid {
		val, err := avgRatingResult.Float64Value()
		if err == nil {
			avgRating = &val.Float64
		}
	}

	// Update product stats
	err = s.queries.UpdateProductStats(ctx, sqlc.UpdateProductStatsParams{
		ID:           productID,
		AvgRating:    avgRating,
		TotalReviews: int32(totalReviews),
	})
	if err != nil {
		return fmt.Errorf("failed to update product stats: %w", err)
	}

	return nil
}

// Helper conversion functions

func convertReviewRowsToDomain(rows []sqlc.GetReviewsByProductRow) ([]*domain.Review, error) {
	domainReviews := make([]*domain.Review, 0, len(rows))
	for _, row := range rows {
		domainReview, err := SQLCToDomainReviewFromProductRow(row)
		if err != nil {
			return nil, fmt.Errorf("failed to convert review: %w", err)
		}
		domainReviews = append(domainReviews, domainReview)
	}
	return domainReviews, nil
}

func convertUserReviewRowsToDomain(rows []sqlc.GetReviewsByUserRow) ([]*domain.Review, error) {
	domainReviews := make([]*domain.Review, 0, len(rows))
	for _, row := range rows {
		domainReview, err := SQLCToDomainReviewFromUserRow(row)
		if err != nil {
			return nil, fmt.Errorf("failed to convert review: %w", err)
		}
		domainReviews = append(domainReviews, domainReview)
	}
	return domainReviews, nil
}

// SQLCToDomainReview converts a SQLC Review to a domain Review
func SQLCToDomainReview(sqlcReview sqlc.Review) (*domain.Review, error) {
	rating, err := domain.NewRating(int(sqlcReview.Rating))
	if err != nil {
		return nil, err
	}

	createdAt := time.Time{}
	if sqlcReview.CreatedAt.Valid {
		createdAt = sqlcReview.CreatedAt.Time
	}

	updatedAt := time.Time{}
	if sqlcReview.UpdatedAt.Valid {
		updatedAt = sqlcReview.UpdatedAt.Time
	}

	var deletedAt *time.Time
	if sqlcReview.DeletedAt.Valid {
		deletedAt = &sqlcReview.DeletedAt.Time
	}

	title := ""
	if sqlcReview.Title != nil {
		title = *sqlcReview.Title
	}

	return &domain.Review{
		ID:           sqlcReview.ID,
		ProductID:    sqlcReview.ProductID,
		UserID:       sqlcReview.UserID,
		Title:        title,
		Body:         sqlcReview.Body,
		Rating:       rating,
		Status:       domain.ReviewStatus(sqlcReview.Status),
		HelpfulCount: int(sqlcReview.UpvoteCount),
		FlagCount:    int(sqlcReview.FlagCount),
		Edited:       sqlcReview.Edited,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}

// SQLCToDomainReviewFromGetReviewRow converts a GetReviewRow to a domain Review
func SQLCToDomainReviewFromGetReviewRow(row sqlc.GetReviewRow) (*domain.Review, error) {
	rating, err := domain.NewRating(int(row.Rating))
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

	title := ""
	if row.Title != nil {
		title = *row.Title
	}

	return &domain.Review{
		ID:           row.ID,
		ProductID:    row.ProductID,
		UserID:       row.UserID,
		Title:        title,
		Body:         row.Body,
		Rating:       rating,
		Status:       domain.ReviewStatus(row.Status),
		HelpfulCount: int(row.UpvoteCount),
		FlagCount:    int(row.FlagCount),
		Edited:       row.Edited,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}

// SQLCToDomainReviewFromProductRow converts a GetReviewsByProductRow to a domain Review
func SQLCToDomainReviewFromProductRow(row sqlc.GetReviewsByProductRow) (*domain.Review, error) {
	rating, err := domain.NewRating(int(row.Rating))
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

	title := ""
	if row.Title != nil {
		title = *row.Title
	}

	return &domain.Review{
		ID:           row.ID,
		ProductID:    row.ProductID,
		UserID:       row.UserID,
		Title:        title,
		Body:         row.Body,
		Rating:       rating,
		Status:       domain.ReviewStatus(row.Status),
		HelpfulCount: int(row.UpvoteCount),
		FlagCount:    int(row.FlagCount),
		Edited:       row.Edited,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}

// SQLCToDomainReviewFromUserRow converts a GetReviewsByUserRow to a domain Review
func SQLCToDomainReviewFromUserRow(row sqlc.GetReviewsByUserRow) (*domain.Review, error) {
	rating, err := domain.NewRating(int(row.Rating))
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

	title := ""
	if row.Title != nil {
		title = *row.Title
	}

	return &domain.Review{
		ID:           row.ID,
		ProductID:    row.ProductID,
		UserID:       row.UserID,
		Title:        title,
		Body:         row.Body,
		Rating:       rating,
		Status:       domain.ReviewStatus(row.Status),
		HelpfulCount: int(row.UpvoteCount),
		FlagCount:    int(row.FlagCount),
		Edited:       row.Edited,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
		DeletedAt:    deletedAt,
	}, nil
}
