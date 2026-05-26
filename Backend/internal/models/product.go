package models

type Tag struct {
	ID   int    `gorm:"column:id;primaryKey" json:"id"`
	Name string `gorm:"column:name" json:"name"`
}

func (Tag) TableName() string { return "tags" }

type Product struct {
	ID          int    `gorm:"column:id;primaryKey" json:"id"`
	Name        string `gorm:"column:name" json:"name"`
	Count       int    `gorm:"column:count" json:"count"`
	Description string `gorm:"column:description" json:"description"`
	Price       int    `gorm:"column:price" json:"price"`
	ImageURL    string `gorm:"column:image_url" json:"image_url"`
	TagID       int    `gorm:"column:tag_id" json:"tag_id"`
}

func (Product) TableName() string { return "products" }
