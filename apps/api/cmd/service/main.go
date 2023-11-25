package main

import (
	"log"
	"net/http"
	"os"
	"studician/api/internal/db"
	"studician/api/internal/handler"
	"studician/api/internal/utils"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file: ", err)
	}

	db.Connect()
	defer db.Close()

	e := echo.New()
	e.Validator = &utils.CustomValidator{Validator: validator.New()}

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "API is running")
	})

	e.GET("/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})

	auth := e.Group("/auth")
	auth.POST("/login", handler.Login)
	auth.POST("/signup", handler.Signup)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}
