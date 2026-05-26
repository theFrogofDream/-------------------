package models

import "time"

type Status struct {
	ID   int    `gorm:"column:id;primaryKey" json:"id"`
	Name string `gorm:"column:name" json:"name"`
}

func (Status) TableName() string { return "statuses" }

type Order struct {
	ID        int       `gorm:"column:id;primaryKey" json:"id"`
	Adress    string    `gorm:"column:adress" json:"adress"`
	Date      time.Time `gorm:"column:date;type:date" json:"date"`
	FullPrice int       `gorm:"column:Full_price" json:"full_price"`
	UserID    int       `gorm:"column:user_id" json:"user_id"`
	StatusID  int       `gorm:"column:status_id" json:"status_id"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	Status    Status    `gorm:"foreignKey:StatusID" json:"-"`
	Items     []ProductInOrder `gorm:"foreignKey:OrderID" json:"-"`
}

func (Order) TableName() string { return "orders" }

type ProductInOrder struct {
	ID        int `gorm:"column:id;primaryKey" json:"id"`
	Count     int `gorm:"column:count" json:"count"`
	ProductID int `gorm:"column:product_id" json:"product_id"`
	OrderID   int `gorm:"column:order_id" json:"order_id"`
	Product   Product `gorm:"foreignKey:ProductID" json:"-"`
}

func (ProductInOrder) TableName() string { return "products_in_orders" }
