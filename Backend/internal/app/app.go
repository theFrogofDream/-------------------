package app

import (
	"Backend/internal/router"

	"github.com/gin-gonic/gin"
)

func Run() {
	h := gin.Default()

	router.Register(h)

	h.Run(":8080")
}
