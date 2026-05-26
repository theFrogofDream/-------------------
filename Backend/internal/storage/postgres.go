package storage

import (
	"database/sql"
	"fmt"
	"log"

	"Backend/internal/config"
	"Backend/internal/migration"

	_ "github.com/jackc/pgx/v5/stdlib"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ensureDatabase(cfg *config.Config) {
	if cfg.DBName == "postgres" {
		return
	}

	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/postgres?sslmode=disable",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort,
	)
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("postgres admin connect: %v", err)
	}
	defer db.Close()

	var exists bool
	if err := db.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)",
		cfg.DBName,
	).Scan(&exists); err != nil {
		log.Fatalf("postgres check database: %v", err)
	}

	if !exists {
		if _, err := db.Exec(fmt.Sprintf(`CREATE DATABASE "%s"`, cfg.DBName)); err != nil {
			log.Fatalf("postgres create database: %v", err)
		}
		log.Printf("created database %q", cfg.DBName)
	}
}

func NewPostgres(cfg *config.Config) *gorm.DB {
	ensureDatabase(cfg)

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("postgres connect: %v", err)
	}

	migration.RunSchema(db)
	return db
}
