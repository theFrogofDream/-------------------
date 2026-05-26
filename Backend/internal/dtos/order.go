package dtos

type OrderItemRequest struct {
	ProductID int `json:"product_id" binding:"required"`
	Count     int `json:"count" binding:"required,min=1"`
	Price     int `json:"price"`
}

type RegPayRequest struct {
	UserID    int                `json:"user_id" binding:"required"`
	Adress    string             `json:"adress" binding:"required"`
	Date      string             `json:"date" binding:"required"`
	Products  []OrderItemRequest `json:"products" binding:"required,min=1"`
	FullPrice int                `json:"full_price"`
}

type OrderStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type OrderItemResponse struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Qty      int    `json:"qty"`
	ImageURL string `json:"image_url"`
}

type OrderResponse struct {
	ID        int                 `json:"id"`
	Adress    string              `json:"adress"`
	Date      string              `json:"date"`
	FullPrice int                 `json:"full_price"`
	Status    string              `json:"status"`
	Products  []OrderItemResponse `json:"products"`
}
