MigrationName := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

migrate-up:
	@goose -dir internal/db/migrations sqlite3 internal/db/db.db up 

migrate-down:
	@goose -dir internal/db/migrations sqlite3 internal/db/db.db down

migration:
	@goose -dir internal/db/migrations create $(MigrationName) sql