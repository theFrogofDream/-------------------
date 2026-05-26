package migration

import (
	"log"

	"Backend/internal/models"

	"gorm.io/gorm"
)

func RunSchema(db *gorm.DB) {
	if err := db.AutoMigrate(
		&models.Role{},
		&models.User{},
		&models.Tag{},
		&models.Product{},
		&models.Status{},
		&models.Order{},
		&models.ProductInOrder{},
	); err != nil {
		log.Fatalf("schema migrate: %v", err)
	}
	log.Println("schema migrate: ok")
}
