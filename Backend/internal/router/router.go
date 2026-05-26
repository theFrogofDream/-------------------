package router

import (
	"Backend/internal/config"
	"Backend/internal/handlers"
	"Backend/internal/middleware"
	"Backend/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Deps struct {
	Config  *config.Config
	User    *handlers.UserHandler
	Product *handlers.ProductHandler
	Order   *handlers.OrderHandler
}

func Register(h *gin.Engine, d Deps) {
	h.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	h.POST("/login", d.User.Login)
	h.POST("/register", d.User.Register)

	h.GET("/products/:tagid", d.Product.List)

	auth := h.Group("/", middleware.Auth(d.Config))
	{
		auth.GET("/orders/:userid", d.Order.ListByUser)
		auth.POST("/regpay", d.Order.RegPay)

		admin := auth.Group("/", middleware.AdminOnly())
		{
			admin.PUT("/productp/:id", d.Product.Update)
			admin.PATCH("/order/:id", d.Order.UpdateStatus)
		}
	}
}

func NewDeps(
	cfg *config.Config,
	userSvc *service.UserService,
	productSvc *service.ProductService,
	orderSvc *service.OrderService,
) Deps {
	return Deps{
		Config:  cfg,
		User:    handlers.NewUserHandler(userSvc),
		Product: handlers.NewProductHandler(productSvc),
		Order:   handlers.NewOrderHandler(orderSvc),
	}
}
