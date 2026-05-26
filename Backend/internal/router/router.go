package router

import (
	"github.com/gin-gonic/gin"
)

func Register(h *gin.Engine) {
	h.GET("api/orders/:userid")
	h.GET("api/products/:tagid")
	h.POST("api/login")
	h.POST("api/registr")
	h.POST("api/regpay")
	h.PUT("api/productp/:id")
	h.PATCH("api/order/:id")
}
