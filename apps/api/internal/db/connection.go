package db

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

var conn *pgx.Conn

func Connect() {
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		log.Fatal("DATABASE_URL must be set")
	}

	var err error
	conn, err = pgx.Connect(context.Background(), dbUrl)
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}
}

func GetQueryClient() *Queries {
	return New(conn)
}

func Close() {
	conn.Close(context.Background())
}
