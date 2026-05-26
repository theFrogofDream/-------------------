package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type CartItem struct {
	ProductID int `json:"product_id"`
	Count     int `json:"count"`
	Price     int `json:"price"`
}

type CartService struct {
	rdb *redis.Client
}

func NewCartService(rdb *redis.Client) *CartService {
	return &CartService{rdb: rdb}
}

func cartKey(userID int) string {
	return fmt.Sprintf("cart:%d", userID)
}

func (s *CartService) Save(ctx context.Context, userID int, items []CartItem) error {
	data, err := json.Marshal(items)
	if err != nil {
		return err
	}
	return s.rdb.Set(ctx, cartKey(userID), data, 7*24*time.Hour).Err()
}

func (s *CartService) Get(ctx context.Context, userID int) ([]CartItem, error) {
	data, err := s.rdb.Get(ctx, cartKey(userID)).Bytes()
	if err == redis.Nil {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var items []CartItem
	if err := json.Unmarshal(data, &items); err != nil {
		return nil, err
	}
	return items, nil
}

func (s *CartService) Clear(ctx context.Context, userID int) error {
	return s.rdb.Del(ctx, cartKey(userID)).Err()
}
