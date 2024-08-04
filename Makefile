include .env

MigrationName := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

migrate-up:
	@goose -dir $(MIGRATION_DIR) sqlite3 $(DB_PATH) up 

migrate-down:
	@goose -dir $(MIGRATION_DIR) sqlite3 $(DB_PATH) down

migration:
	@goose -dir $(MIGRATION_DIR) create $(MigrationName) sql

data:
	@echo "${DB_PATH}"