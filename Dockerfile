FROM imbios/bun-node:latest-iron-alpine

WORKDIR /app
COPY . .

RUN bun i
RUN bun --bun run build

EXPOSE 3000

ENTRYPOINT ["sh", "./scripts/run.sh"]