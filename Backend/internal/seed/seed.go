package seed

import (
	"Backend/internal/migration"

	"gorm.io/gorm"
)

func Run(db *gorm.DB) {
	migration.SeedMock(db)
}
