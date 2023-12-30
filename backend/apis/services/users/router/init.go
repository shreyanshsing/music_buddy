package users

import (
	handlers "music_buddy/services/users/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(apiEntryPoint *fiber.Router) {
	userApi := (*apiEntryPoint).Group("/user")
	userApi.Get("/", handlers.GetAllUsers)
	userApi.Get("/:id", handlers.GetUser)
	userApi.Patch("/:id", handlers.UpdateUserProfile)
	userApi.Get(("/:id/friends"), handlers.GetFriendsList)
}
