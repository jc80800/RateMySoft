-- name: CreateProduct :one
INSERT INTO products (
    id, company_id, name, slug, category, short_tagline, description,
    homepage_url, docs_url, avg_rating, total_reviews, created_at, updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
) RETURNING *;

-- name: GetProduct :one
SELECT * FROM products
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetProductBySlug :one
SELECT p.*, c.name as company_name, c.slug as company_slug
FROM products p
JOIN companies c ON p.company_id = c.id
WHERE p.slug = $1 AND p.deleted_at IS NULL AND c.deleted_at IS NULL;

-- name: GetProductsByCompany :many
SELECT * FROM products
WHERE company_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: ListProducts :many
SELECT p.*, c.name as company_name, c.slug as company_slug
FROM products p
JOIN companies c ON p.company_id = c.id
WHERE p.deleted_at IS NULL AND c.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT $1 OFFSET $2;

-- name: ListProductsByCategory :many
SELECT p.*, c.name as company_name, c.slug as company_slug
FROM products p
JOIN companies c ON p.company_id = c.id
WHERE p.category = $1 AND p.deleted_at IS NULL AND c.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT $2 OFFSET $3;

-- name: SearchProducts :many
SELECT p.*, c.name as company_name, c.slug as company_slug
FROM products p
JOIN companies c ON p.company_id = c.id
WHERE p.deleted_at IS NULL AND c.deleted_at IS NULL
AND (p.name ILIKE $1 OR p.short_tagline ILIKE $1 OR c.name ILIKE $1)
ORDER BY p.name ASC
LIMIT $2 OFFSET $3;

-- name: UpdateProduct :one
UPDATE products
SET 
    name = $2,
    slug = $3,
    category = $4,
    short_tagline = $5,
    description = $6,
    homepage_url = $7,
    docs_url = $8,
    avg_rating = $9,
    total_reviews = $10,
    updated_at = $11
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateProductStats :exec
UPDATE products
SET 
    avg_rating = $2,
    total_reviews = $3,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteProduct :exec
UPDATE products
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: HardDeleteProduct :exec
DELETE FROM products
WHERE id = $1;

-- name: CountProducts :one
SELECT COUNT(*) FROM products
WHERE deleted_at IS NULL;

-- name: CountProductsByCompany :one
SELECT COUNT(*) FROM products
WHERE company_id = $1 AND deleted_at IS NULL;