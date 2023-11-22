-- name: GetUserByEmailOrUsername :one
SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1;
