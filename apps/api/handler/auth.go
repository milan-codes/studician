package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type LoginDTO struct {
	EmailOrUsername    string `json:"emailOrUsername" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func Login(c echo.Context) error {
	user := new(LoginDTO)
	if err := c.Bind(user); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(user); err != nil {
		return err
	}
	return c.JSON(http.StatusOK, user)
}