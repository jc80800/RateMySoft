package domain

import "time"

type ReviewStatus string

const (
	ReviewPending   ReviewStatus = "pending"
	ReviewPublished ReviewStatus = "published"
	ReviewRejected  ReviewStatus = "rejected"
)

type Review struct {
	ID           ID
	ProductID    ID
	UserID       ID
	Title        string
	Body         string
	Rating       Rating
	Status       ReviewStatus
	HelpfulCount int
	FlagCount    int
	Edited       bool

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

func NewReview(productID, userID ID, rating Rating, body string, now time.Time) *Review {
	return &Review{
		ID:           NewID(),
		ProductID:    productID,
		UserID:       userID,
		Body:         body,
		Rating:       rating,
		Status:       ReviewPending, // default: moderation queue
		CreatedAt:    now.UTC(),
		UpdatedAt:    now.UTC(),
		HelpfulCount: 0,
		FlagCount:    0,
	}
}

func (r *Review) Touch(now time.Time) { r.UpdatedAt = now.UTC() }
