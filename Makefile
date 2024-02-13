DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_UP = $(DOCKER_COMPOSE) up
DOCKER_COMPOSE_STOP = $(DOCKER_COMPOSE) stop

PNPM = pnpm

GREEN=\033[0;32m
RED=\033[0;31m
BLUE=\033[0;34m
COLOR_END=\033[0m

API_CONTAINER = world-of-studies-api
API_SHELL = docker exec -itu 1000 $(API_CONTAINER)

## === 🐋  DOCKER ================================================
docker-up: ## Start docker containers
	$(DOCKER_COMPOSE_UP)

docker-up-build: ## Create and start docker containers
	$(DOCKER_COMPOSE_UP) --build

docker-up-build-d: ## Create and start docker containers with d option
	$(DOCKER_COMPOSE_UP) --build -d

docker-stop: ## Stop docker containers
	$(DOCKER_COMPOSE_STOP)
#---------------------------------------------#


## === 📦  PNPM ================================================
pnpm-install: ## Install pnpm dependencies
	@echo "$(BLUE)Installing pnpm dependencies...$(COLOR_END)"
	$(PNPM) install
#---------------------------------------------#


## === 🗄 DATABASE ================================================
db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(COLOR_END)"
	$(API_SHELL) $(PNPM) --filter=api migration:run
#---------------------------------------------#


## === ⭐  OTHERS ================================================
first-install: pnpm-install docker-up-build-d db-migrate

start: ## Start the project
	$(MAKE) docker-up-build

help: ## Show this help
	@echo "WorldOfStudies - Makefile"
	@echo "---------------------------"
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
#---------------------------------------------#
