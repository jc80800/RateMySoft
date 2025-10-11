package handlers

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"ratemysoft-backend/internal/auth"
	"ratemysoft-backend/internal/services"
	"ratemysoft-backend/internal/transport/http/dto"

	"github.com/labstack/echo/v4"
)

// CreateReview creates a new review
func (h *Handler) CreateReview(c echo.Context) error {
	// Get authenticated user ID from context
	userID, err := auth.GetUserIDFromContext(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "User not authenticated",
		})
	}

	var req dto.CreateReviewRequest
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

	review, err := h.reviewService.CreateReview(ctx, services.CreateReviewRequest{
		ProductID: req.ProductID,
		UserID:    userID.String(),
		Title:     strings.TrimSpace(req.Title),
		Body:      strings.TrimSpace(req.Body),
		Rating:    req.Rating,
	})
	if err != nil {
		if strings.Contains(err.Error(), "already reviewed") {
			return c.JSON(http.StatusConflict, map[string]string{
				"error": "You have already reviewed this product",
			})
		}
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": err.Error(),
			})
		}
		if strings.Contains(err.Error(), "invalid rating") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to create review",
			"details": err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, dto.ReviewResponse{
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
	})
}

// GetReview retrieves a review by ID
func (h *Handler) GetReview(c echo.Context) error {
	reviewID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	review, err := h.reviewService.GetReviewByID(ctx, reviewID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Review not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid review ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get review",
		})
	}

	return c.JSON(http.StatusOK, dto.ReviewResponse{
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
	})
}

// GetReviewsByProduct retrieves reviews for a product
func (h *Handler) GetReviewsByProduct(c echo.Context) error {
	productID := c.Param("productId")

	// Parse sort parameter
	sortBy := c.QueryParam("sort")
	if sortBy == "" {
		sortBy = "recent"
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

	// Get total count
	total, err := h.reviewService.CountReviewsByProduct(ctx, productID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to count reviews",
		})
	}

	// Get reviews
	reviews, err := h.reviewService.GetReviewsByProduct(ctx, productID, sortBy, limit, offset)
	if err != nil {
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get reviews",
		})
	}

	// Convert to response DTOs
	reviewResponses := make([]dto.ReviewResponse, 0, len(reviews))
	for _, review := range reviews {
		reviewResponses = append(reviewResponses, dto.ReviewResponse{
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
		})
	}

	return c.JSON(http.StatusOK, dto.ReviewListResponse{
		Reviews: reviewResponses,
		Total:   total,
		Limit:   limit,
		Offset:  offset,
	})
}

// GetReviewsByUser retrieves all reviews by a user
func (h *Handler) GetReviewsByUser(c echo.Context) error {
	userID := c.Param("userId")

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
	total, err := h.reviewService.CountReviewsByUser(ctx, userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to count reviews",
		})
	}

	// Get reviews
	reviews, err := h.reviewService.GetReviewsByUser(ctx, userID, limit, offset)
	if err != nil {
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid user ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to get reviews",
		})
	}

	// Convert to response DTOs
	reviewResponses := make([]dto.ReviewResponse, 0, len(reviews))
	for _, review := range reviews {
		reviewResponses = append(reviewResponses, dto.ReviewResponse{
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
		})
	}

	return c.JSON(http.StatusOK, dto.ReviewListResponse{
		Reviews: reviewResponses,
		Total:   total,
		Limit:   limit,
		Offset:  offset,
	})
}

// UpdateReview updates an existing review
func (h *Handler) UpdateReview(c echo.Context) error {
	reviewID := c.Param("id")

	// Get authenticated user ID from context
	userID, err := auth.GetUserIDFromContext(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "User not authenticated",
		})
	}

	var req dto.UpdateReviewRequest
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

	review, err := h.reviewService.UpdateReview(ctx, reviewID, userID.String(), services.UpdateReviewRequest{
		Title:  strings.TrimSpace(req.Title),
		Body:   strings.TrimSpace(req.Body),
		Rating: req.Rating,
	})
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Review not found",
			})
		}
		if strings.Contains(err.Error(), "unauthorized") {
			return c.JSON(http.StatusForbidden, map[string]string{
				"error": "You can only edit your own reviews",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "Failed to update review",
			"details": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ReviewResponse{
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
	})
}

// DeleteReview soft deletes a review
func (h *Handler) DeleteReview(c echo.Context) error {
	reviewID := c.Param("id")

	// Get authenticated user ID from context
	userID, err := auth.GetUserIDFromContext(c)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"error": "User not authenticated",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = h.reviewService.DeleteReview(ctx, reviewID, userID.String())
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Review not found",
			})
		}
		if strings.Contains(err.Error(), "unauthorized") {
			return c.JSON(http.StatusForbidden, map[string]string{
				"error": "You can only delete your own reviews",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid review ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to delete review",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Review deleted successfully",
	})
}

// UpvoteReview increments the upvote count for a review
func (h *Handler) UpvoteReview(c echo.Context) error {
	reviewID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.reviewService.IncrementUpvote(ctx, reviewID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Review not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid review ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to upvote review",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Review upvoted successfully",
	})
}

// DownvoteReview increments the downvote count for a review
func (h *Handler) DownvoteReview(c echo.Context) error {
	reviewID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.reviewService.IncrementDownvote(ctx, reviewID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Review not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid review ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to downvote review",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Review downvoted successfully",
	})
}

// FlagReview increments the flag count for a review
func (h *Handler) FlagReview(c echo.Context) error {
	reviewID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.reviewService.IncrementFlag(ctx, reviewID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Review not found",
			})
		}
		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid review ID",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to flag review",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Review flagged successfully",
	})
}
