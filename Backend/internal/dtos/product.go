package dtos

type ProductUpdateRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Price       int    `json:"price" binding:"required"`
	Count       int    `json:"count"`
	ImageURL    string `json:"image_url"`
	TagID       int    `json:"tag_id"`
}

type ProductResponse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Count       int    `json:"count"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	ImageURL    string `json:"image_url"`
	TagID       int    `json:"tag_id"`
}
