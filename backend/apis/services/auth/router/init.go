package auth

import "github.com/gofiber/fiber/v2"
import (
	handlers "music_buddy/services/auth/handlers"
)

func SetupRoutes(apiEntryPoint *fiber.Router) {
	authApi := (*apiEntryPoint).Group("/auth")
	authApi.Post("/register", handlers.Register)
	authApi.Post("/login", handlers.Login)
}