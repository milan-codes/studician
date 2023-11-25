-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 LIMIT 1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1 LIMIT 1;

-- name: GetUserByEmailOrUsername :one
SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1;

-- name: InsertUser :one
INSERT INTO users (
    username,
    email,
    password
) VALUES (
    $1,
    $2,
    $3
) RETURNING username, email, created_at, updated_at;
