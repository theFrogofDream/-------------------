package app

import (
	"os"

	"Backend/internal/config"
	"Backend/internal/repositories"
	"Backend/internal/router"
	"Backend/internal/seed"
	"Backend/internal/service"
	"Backend/internal/storage"

	"github.com/gin-gonic/gin"
)

func Run() {
	cfg := config.Load()

	db := storage.NewPostgres(cfg)
	rdb := storage.NewRedis(cfg)

	seed.Run(db)

	userRepo := repositories.NewUserRepository(db)
	productRepo := repositories.NewProductRepository(db)
	orderRepo := repositories.NewOrderRepository(db)

	cartSvc := service.NewCartService(rdb)
	userSvc := service.NewUserService(userRepo, cfg)
	productSvc := service.NewProductService(productRepo)
	orderSvc := service.NewOrderService(orderRepo, productRepo, cartSvc)

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	h := gin.Default()
	deps := router.NewDeps(cfg, userSvc, productSvc, orderSvc)
	router.Register(h, deps)

	h.Run(":" + cfg.Port)
}
