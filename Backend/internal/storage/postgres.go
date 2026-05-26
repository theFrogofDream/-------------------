package storage

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Conn(role string) (db *gorm.DB) {
	if role == "user" {
		dsn := "host=localhost user=user password=user_password dbname=testdb port=5432 sslmode=disable"
		return conn(dsn)
	} else {
		dsn := "host=localhost user=admin password=admin_password dbname=testdb port=5432 sslmode=disable"
		return conn(dsn)
	}
}

func conn(dsn string) (db *gorm.DB) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	return db
}
