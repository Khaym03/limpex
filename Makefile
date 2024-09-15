include .env

MigrationName := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

migrate-up:
	@goose -dir $(MIGRATION_DIR)/sqlite sqlite3 $(DB_PATH) up 

migrate-down:
	@goose -dir $(MIGRATION_DIR)/sqlite sqlite3 $(DB_PATH) down

migration:
	@goose -dir $(MIGRATION_DIR)/sqlite create $(MigrationName) sql

data:
	@echo "${DB_PATH}"


migration-psql:
	@goose -dir $(MIGRATION_DIR)/psql create $(MigrationName) sql

migrate-psql-up:
	@goose -dir $(MIGRATION_DIR)/psql postgres "user=$(POSTGRES_USER) password=$(POSTGRES_PASSWORD) dbname=$(POSTGRES_DATABASE) host=$(POSTGRES_HOST) sslmode=require" up

migrate-psql-down:
	@goose -dir $(MIGRATION_DIR)/psql postgres "user=$(POSTGRES_USER) password=$(POSTGRES_PASSWORD) dbname=$(POSTGRES_DATABASE) host=$(POSTGRES_HOST) sslmode=require" down

