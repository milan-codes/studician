package utils

import (
	"net/http"
	"regexp"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type CustomValidator struct {
	Validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	cv.Validator.RegisterValidation("pwd", validatePassword)
  if err := cv.Validator.Struct(i); err != nil {
    return echo.NewHTTPError(http.StatusBadRequest, err.Error())
  }
  return nil
}

func validatePassword(fl validator.FieldLevel) bool {
  password := fl.Field().String()
  numeric := regexp.MustCompile(`[0-9]`)
  uppercase := regexp.MustCompile(`[A-Z]`)
  lowercase := regexp.MustCompile(`[a-z]`)
  special := regexp.MustCompile(`[!@#$%^&*()_+]`)
  return len(password) >= 8 &&
  		 len(password) <= 64 &&
		 numeric.MatchString(password) &&
		 uppercase.MatchString(password) &&
		 lowercase.MatchString(password) &&
		 special.MatchString(password)
}