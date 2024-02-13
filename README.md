# WorldOfStudies

## Installation

### With the Makefile

Simply use `make first-install`

### Manually

Install pnpm dependencies

```sh
pnpm install
```

Build/Start docker containers

```sh
docker compose up --build
```

Run DB migrations

```sh
docker exec -itu 1000 world-of-studies-api pnpm  --filter=api migration:run
```

## Commands

### Api

- Run migrations: `node ace migration:run` (in the docker container)
- Create validator: `node ace make:validator userValidator`
