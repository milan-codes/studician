# Studician

- [Studician](#studician)
  - [Development](#development)
  - [Production](#production)
  - [Docker](#docker)
  - [Environment variables](#environment-variables)

## Development

1. `bun install`: Install dependencies
2. `bun db:migrate`: Run migrations (if database is not up to date)
3. `bun dev`: Start the development server

## Production

1. `bun install`: Install dependencies
2. `bun run build`: Build the app

## Docker

1. `docker compose up -d`: Start the app with a PostgreSQL and a Gemma 3 instance
2. `docker compose down`: Stop the app

## Environment variables

- `DATABASE_URL`: PostgreSQL connection string
- `OLLAMA_URL`: Base URL of the Ollama server used to send requests to Gemma 3
