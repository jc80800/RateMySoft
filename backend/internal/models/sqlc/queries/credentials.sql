-- name: CreateCredential :one
INSERT INTO credentials (
    user_id, provider, identifier, secret_hash, created_at, updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: GetCredential :one
SELECT * FROM credentials
WHERE user_id = $1 AND provider = $2 AND deleted_at IS NULL;

-- name: GetCredentialByIdentifier :one
SELECT * FROM credentials
WHERE provider = $1 AND identifier = $2 AND deleted_at IS NULL;

-- name: UpdateCredential :one
UPDATE credentials
SET 
    identifier = $3,
    secret_hash = $4,
    updated_at = $5
WHERE user_id = $1 AND provider = $2 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteCredential :exec
UPDATE credentials
SET deleted_at = NOW()
WHERE user_id = $1 AND provider = $2 AND deleted_at IS NULL;

-- name: HardDeleteCredential :exec
DELETE FROM credentials
WHERE user_id = $1 AND provider = $2;
