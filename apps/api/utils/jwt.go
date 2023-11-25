package utils

import (
	"log"
	"os"

	"github.com/golang-jwt/jwt/v4"
)

type JwtClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func CreateToken(claims *JwtClaims) (string, error) {
	secret := os.Getenv("JWT_SECRET"); if secret == "" {
		log.Fatal("JWT_SECRET not set")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}