package handler

import (
	"context"
	"net/http"
	"studician/api/internal/db"
	"studician/api/internal/utils"
	"time"

	"github.com/alexedwards/argon2id"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
)

type LoginDTO struct {
	EmailOrUsername string `json:"emailOrUsername" validate:"required"`
	Password        string `json:"password" validate:"required"`
}

type SignupDTO struct {
	Username string `json:"username" validate:"required,min=1,max=32"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,pwd"`
}

func Login(c echo.Context) error {
	user := new(LoginDTO)
	if err := c.Bind(user); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(user); err != nil {
		return err
	}

	q := db.GetQueryClient()
	userFromDB, err := q.GetUserByEmailOrUsername(context.Background(), user.EmailOrUsername)
	if err != nil {
		if err == pgx.ErrNoRows {
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Something went wrong")
	}

	passwordsMatch, err := argon2id.ComparePasswordAndHash(user.Password, userFromDB.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Something went wrong")
	}

	if !passwordsMatch {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	claims := &utils.JwtClaims{
		Username: userFromDB.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}

	signedToken, err := utils.CreateToken(claims)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Couldn't issue token")
	}

	return c.JSON(http.StatusCreated, map[string]string{
		"token": signedToken,
	})
}

func Signup(c echo.Context) error {
	user := new(SignupDTO)
	if err := c.Bind(user); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(user); err != nil {
		return err
	}

	q := db.GetQueryClient()
	_, err := q.GetUserByEmail(context.Background(), user.Email)
	if err != nil && err != pgx.ErrNoRows {
		return echo.NewHTTPError(http.StatusInternalServerError, "Something went wrong")
	} else if err == nil {
		return echo.NewHTTPError(http.StatusConflict, "A user with this email already exists")
	}

	hashedPassword, err := argon2id.CreateHash(user.Password, argon2id.DefaultParams)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Something went wrong")
	}
	user.Password = hashedPassword

	insertedUser, err := q.InsertUser(context.Background(), db.InsertUserParams{
		Username: user.Username,
		Email:    user.Email,
		Password: user.Password,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Something went wrong")
	}

	return c.JSON(http.StatusOK, insertedUser)
}
