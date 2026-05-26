package service

import (
	"errors"

	"Backend/internal/dtos"
	"Backend/internal/models"
	"Backend/internal/repositories"

	"gorm.io/gorm"
)

type ProductService struct {
	repo *repositories.ProductRepository
}

func NewProductService(repo *repositories.ProductRepository) *ProductService {
	return &ProductService{repo: repo}
}

func (s *ProductService) List(tagID int) ([]dtos.ProductResponse, error) {
	list, err := s.repo.ListByTag(tagID)
	if err != nil {
		return nil, err
	}
	out := make([]dtos.ProductResponse, len(list))
	for i, p := range list {
		out[i] = toProductResponse(p)
	}
	return out, nil
}

func (s *ProductService) Update(id int, req dtos.ProductUpdateRequest) error {
	p, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("товар не найден")
		}
		return err
	}

	if req.Count <= 0 {
		return s.repo.Delete(id)
	}

	p.Name = req.Name
	p.Description = req.Description
	p.Price = req.Price
	p.Count = req.Count
	p.ImageURL = req.ImageURL
	p.TagID = req.TagID
	return s.repo.Update(p)
}

func toProductResponse(p models.Product) dtos.ProductResponse {
	return dtos.ProductResponse{
		ID:          p.ID,
		Name:        p.Name,
		Count:       p.Count,
		Description: p.Description,
		Price:       p.Price,
		ImageURL:    p.ImageURL,
		TagID:       p.TagID,
	}
}
