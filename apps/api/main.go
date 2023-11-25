package main

import (
	"log"
	"net/http"
	"os"
	"studician/api/db"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file: ", err)
    }

    db.Connect(); defer db.Close()

    e := echo.New()

    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, "API is running")
    })

	e.GET("/ping", func(c echo.Context) error {
        return c.String(http.StatusOK, "pong")
    })

    port := os.Getenv("PORT"); if port == "" {
        port = "3001"
    }
    e.Logger.Fatal(e.Start(":" + port))
}