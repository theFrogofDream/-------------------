package service

import (
	"context"
	"errors"
	"time"

	"Backend/internal/dtos"
	"Backend/internal/models"
	"Backend/internal/repositories"

	"gorm.io/gorm"
)

type OrderService struct {
	orderRepo   *repositories.OrderRepository
	productRepo *repositories.ProductRepository
	cart        *CartService
}

func NewOrderService(
	orderRepo *repositories.OrderRepository,
	productRepo *repositories.ProductRepository,
	cart *CartService,
) *OrderService {
	return &OrderService{orderRepo: orderRepo, productRepo: productRepo, cart: cart}
}

func (s *OrderService) ListForUser(userID int, requesterID int, requesterRole string) ([]dtos.OrderResponse, error) {
	var list []models.Order
	var err error

	if requesterRole == "admin" && userID == 0 {
		list, err = s.orderRepo.ListAll()
	} else {
		if requesterRole != "admin" && userID != requesterID {
			return nil, errors.New("доступ запрещён")
		}
		list, err = s.orderRepo.ListByUser(userID)
	}
	if err != nil {
		return nil, err
	}

	out := make([]dtos.OrderResponse, len(list))
	for i, o := range list {
		out[i] = toOrderResponse(o)
	}
	return out, nil
}

func (s *OrderService) RegPay(ctx context.Context, req dtos.RegPayRequest, authUserID int) error {
	if req.UserID != authUserID {
		return errors.New("нельзя оформить заказ за другого пользователя")
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return errors.New("неверный формат даты")
	}

	orderID, err := s.orderRepo.NextOrderID()
	if err != nil {
		return err
	}
	nextItemID, err := s.orderRepo.NextItemID()
	if err != nil {
		return err
	}

	total := 0
	items := make([]models.ProductInOrder, 0, len(req.Products))

	err = s.orderRepo.DB().Transaction(func(tx *gorm.DB) error {
		for i, line := range req.Products {
			p, err := s.productRepo.FindByID(line.ProductID)
			if err != nil {
				return errors.New("товар не найден")
			}
			if p.Count < line.Count {
				return errors.New("недостаточно товара на складе: " + p.Name)
			}
			price := line.Price
			if price <= 0 {
				price = p.Price
			}
			total += price * line.Count
			items = append(items, models.ProductInOrder{
				ID:        nextItemID + i,
				Count:     line.Count,
				ProductID: line.ProductID,
			})
			if err := s.productRepo.DecreaseStock(tx, line.ProductID, line.Count); err != nil {
				return err
			}
		}

		if req.FullPrice > 0 {
			total = req.FullPrice
		}

		order := &models.Order{
			ID:        orderID,
			Adress:    req.Adress,
			Date:      date,
			FullPrice: total,
			UserID:    req.UserID,
			StatusID:  1,
			CreatedAt: time.Now(),
		}
		return s.orderRepo.CreateWithTx(tx, order, items)
	})
	if err != nil {
		return err
	}

	_ = s.cart.Save(ctx, authUserID, cartFromRequest(req.Products))
	return s.cart.Clear(ctx, authUserID)
}

func cartFromRequest(products []dtos.OrderItemRequest) []CartItem {
	out := make([]CartItem, len(products))
	for i, p := range products {
		out[i] = CartItem{ProductID: p.ProductID, Count: p.Count, Price: p.Price}
	}
	return out
}

func (s *OrderService) UpdateStatus(orderID int, statusName string) error {
	st, err := s.orderRepo.FindStatusByName(statusName)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("неизвестный статус")
		}
		return err
	}
	_, err = s.orderRepo.FindByID(orderID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("заказ не найден")
		}
		return err
	}
	return s.orderRepo.UpdateStatus(orderID, st.ID)
}

func toOrderResponse(o models.Order) dtos.OrderResponse {
	status := ""
	if o.Status.Name != "" {
		status = o.Status.Name
	}
	items := make([]dtos.OrderItemResponse, len(o.Items))
	for i, it := range o.Items {
		items[i] = dtos.OrderItemResponse{
			ID:       it.Product.ID,
			Name:     it.Product.Name,
			Price:    it.Product.Price,
			Qty:      it.Count,
			ImageURL: it.Product.ImageURL,
		}
	}
	return dtos.OrderResponse{
		ID:        o.ID,
		Adress:    o.Adress,
		Date:      o.Date.Format("2006-01-02"),
		FullPrice: o.FullPrice,
		Status:    status,
		Products:  items,
	}
}
