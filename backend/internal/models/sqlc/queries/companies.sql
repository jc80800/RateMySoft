-- name: CreateCompany :one
INSERT INTO companies (
    id, name, website, slug, logo_url, created_at, updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- name: GetCompany :one
SELECT * FROM companies
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetCompanyBySlug :one
SELECT * FROM companies
WHERE slug = $1 AND deleted_at IS NULL;

-- name: ListCompanies :many
SELECT * FROM companies
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: SearchCompanies :many
SELECT * FROM companies
WHERE deleted_at IS NULL
AND (name ILIKE $1 OR slug ILIKE $1)
ORDER BY name ASC
LIMIT $2 OFFSET $3;

-- name: UpdateCompany :one
UPDATE companies
SET 
    name = $2,
    website = $3,
    slug = $4,
    logo_url = $5,
    updated_at = $6
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteCompany :exec
UPDATE companies
SET deleted_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: HardDeleteCompany :exec
DELETE FROM companies
WHERE id = $1;

-- name: CountCompanies :one
SELECT COUNT(*) FROM companies
WHERE deleted_at IS NULL;