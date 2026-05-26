package models

import "time"

type Role struct {
	ID   int    `gorm:"column:id;primaryKey" json:"id"`
	Name string `gorm:"column:name" json:"name"`
}

func (Role) TableName() string { return "roles" }

type User struct {
	ID        int       `gorm:"column:id;primaryKey" json:"id"`
	Username  string    `gorm:"column:username" json:"username"`
	Email     string    `gorm:"column:email" json:"email"`
	Password  string    `gorm:"column:password" json:"-"`
	RoleID    int       `gorm:"column:role_id" json:"role_id"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	Role      Role      `gorm:"foreignKey:RoleID" json:"-"`
}

func (User) TableName() string { return "users" }
