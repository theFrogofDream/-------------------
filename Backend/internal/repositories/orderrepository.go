package repositories

import (
	"Backend/internal/models"

	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) ListByUser(userID int) ([]models.Order, error) {
	var list []models.Order
	err := r.db.Preload("Status").Preload("Items.Product").
		Where("user_id = ?", userID).Order("id DESC").Find(&list).Error
	return list, err
}

func (r *OrderRepository) ListAll() ([]models.Order, error) {
	var list []models.Order
	err := r.db.Preload("Status").Preload("Items.Product").Order("id DESC").Find(&list).Error
	return list, err
}

func (r *OrderRepository) FindByID(id int) (*models.Order, error) {
	var o models.Order
	err := r.db.Preload("Status").Preload("Items.Product").First(&o, id).Error
	if err != nil {
		return nil, err
	}
	return &o, nil
}

func (r *OrderRepository) CreateWithTx(tx *gorm.DB, o *models.Order, items []models.ProductInOrder) error {
	if err := tx.Create(o).Error; err != nil {
		return err
	}
	for i := range items {
		items[i].OrderID = o.ID
		if err := tx.Create(&items[i]).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *OrderRepository) DB() *gorm.DB {
	return r.db
}

func (r *OrderRepository) UpdateStatus(id, statusID int) error {
	return r.db.Model(&models.Order{}).Where("id = ?", id).Update("status_id", statusID).Error
}

func (r *OrderRepository) NextOrderID() (int, error) {
	var maxID *int
	err := r.db.Model(&models.Order{}).Select("MAX(id)").Scan(&maxID).Error
	if err != nil {
		return 0, err
	}
	if maxID == nil {
		return 1, nil
	}
	return *maxID + 1, nil
}

func (r *OrderRepository) NextItemID() (int, error) {
	var maxID *int
	err := r.db.Model(&models.ProductInOrder{}).Select("MAX(id)").Scan(&maxID).Error
	if err != nil {
		return 0, err
	}
	if maxID == nil {
		return 1, nil
	}
	return *maxID + 1, nil
}

func (r *OrderRepository) FindStatusByName(name string) (*models.Status, error) {
	var s models.Status
	err := r.db.Where("name = ?", name).First(&s).Error
	if err != nil {
		return nil, err
	}
	return &s, nil
}
