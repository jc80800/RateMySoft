-- name: CreateReview :one
INSERT INTO reviews (
    id, product_id, user_id, title, body, rating, status,
    upvote_count, downvote_count, flag_count, edited, created_at, updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
) RETURNING *;

-- name: GetReview :one
SELECT r.*, u.handle as user_handle, p.name as product_name
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN products p ON r.product_id = p.id
WHERE r.id = $1 AND r.deleted_at IS NULL AND u.deleted_at IS NULL AND p.deleted_at IS NULL;

-- name: GetReviewsByProduct :many
SELECT r.*, u.handle as user_handle
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.product_id = $1 AND r.deleted_at IS NULL AND u.deleted_at IS NULL
ORDER BY 
    CASE WHEN $2 = 'upvotes' THEN r.upvote_count END DESC,
    CASE WHEN $2 = 'rating_desc' THEN r.rating END DESC,
    CASE WHEN $2 = 'rating_asc' THEN r.rating END ASC,
    r.created_at DESC
LIMIT $3 OFFSET $4;

-- name: GetReviewsByUser :many
SELECT r.*, p.name as product_name, p.slug as product_slug, c.name as company_name
FROM reviews r
JOIN products p ON r.product_id = p.id
JOIN companies c ON p.company_id = c.id
WHERE r.user_id = $1 AND r.deleted_at IS NULL AND p.deleted_at IS NULL AND c.deleted_at IS NULL
ORDER BY r.created_at DESC
LIMIT $2 OFFSET $3;

-- name: GetReviewsByStatus :many
SELECT r.*, u.handle as user_handle, p.name as product_name
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN products p ON r.product_id = p.id
WHERE r.status = $1 AND r.deleted_at IS NULL AND u.deleted_at IS NULL AND p.deleted_at IS NULL
ORDER BY r.created_at ASC
LIMIT $2 OFFSET $3;

-- name: GetUserReviewForProduct :one
SELECT * FROM reviews
WHERE product_id = $1 AND user_id = $2 AND deleted_at IS NULL;

-- name: UpdateReview :one
UPDATE reviews
SET 
    title = $2,
    body = $3,
    rating = $4,
    status = $5,
    edited = $6,
    updated_at = $7
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateReviewStatus :exec
UPDATE reviews
SET 
    status = $2,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: IncrementUpvoteCount :exec
UPDATE reviews
SET 
    upvote_count = upvote_count + 1,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: IncrementDownvoteCount :exec
UPDATE reviews
SET 
    downvote_count = downvote_count + 1,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: IncrementFlagCount :exec
UPDATE reviews
SET 
    flag_count = flag_count + 1,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteReview :exec
UPDATE reviews
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: HardDeleteReview :exec
DELETE FROM reviews
WHERE id = $1;

-- name: CountReviewsByProduct :one
SELECT COUNT(*) FROM reviews
WHERE product_id = $1 AND deleted_at IS NULL AND status = 'published';

-- name: CountReviewsByUser :one
SELECT COUNT(*) FROM reviews
WHERE user_id = $1 AND deleted_at IS NULL;

-- name: GetAverageRatingByProduct :one
SELECT AVG(rating)::DECIMAL(3,2) as avg_rating
FROM reviews
WHERE product_id = $1 AND deleted_at IS NULL AND status = 'published';