package storage

import (
	"context"
	"log"

	"Backend/internal/config"

	"github.com/redis/go-redis/v9"
)

func NewRedis(cfg *config.Config) *redis.Client {
	client := redis.NewClient(&redis.Options{Addr: cfg.RedisAddr})
	if err := client.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("redis connect: %v", err)
	}
	return client
}
