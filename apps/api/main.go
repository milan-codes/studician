package main

import (
	"context"
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

    db.Connect()
    defer db.Close()
    q := db.GetQueryClient()

    user, err := q.GetUserByEmailOrUsername(context.Background(), "studician"); if err != nil {
        log.Fatal("Error getting user: ", err)
    }

    log.Println(user)

    e := echo.New()

    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, "API is running")
    })

	e.GET("/ping", func(c echo.Context) error {
        return c.String(http.StatusOK, "pong")
    })

    e.Logger.Fatal(e.Start(":" + os.Getenv("PORT")))
}