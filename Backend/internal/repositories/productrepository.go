package repositories

import (
	"errors"

	"Backend/internal/models"

	"gorm.io/gorm"
)

type ProductRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

func (r *ProductRepository) ListByTag(tagID int) ([]models.Product, error) {
	var list []models.Product
	q := r.db.Order("id")
	if tagID > 0 {
		q = q.Where("tag_id = ?", tagID)
	}
	err := q.Find(&list).Error
	return list, err
}

func (r *ProductRepository) FindByID(id int) (*models.Product, error) {
	var p models.Product
	err := r.db.First(&p, id).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProductRepository) Update(p *models.Product) error {
	return r.db.Save(p).Error
}

func (r *ProductRepository) Delete(id int) error {
	return r.db.Delete(&models.Product{}, id).Error
}

func (r *ProductRepository) DecreaseStock(tx *gorm.DB, id, qty int) error {
	db := r.db
	if tx != nil {
		db = tx
	}
	res := db.Model(&models.Product{}).Where("id = ? AND count >= ?", id, qty).
		UpdateColumn("count", gorm.Expr("count - ?", qty))
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return errors.New("недостаточно товара на складе")
	}
	return nil
}
