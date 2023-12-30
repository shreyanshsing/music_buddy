package invites

import (
	"github.com/gofiber/fiber/v2"
	handlers "music_buddy/services/invites/handlers"
)

func SetupRoutes(apiEntryPoint *fiber.Router) {
	invites := (*apiEntryPoint).Group("/invites")
	invites.Post("/", handlers.CreateInvite)
	invites.Patch("/:id", handlers.AcceptInvite)
	invites.Get("/", handlers.GetAllInvites)
}