package collection

import (
	handlers "music_buddy/services/collections/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(apiEntryPoint *fiber.Router) {
	collectionApi := (*apiEntryPoint).Group("/collection")
	collectionApi.Post("/", handlers.CreateCollection)
	collectionApi.Get("/", handlers.GetAllCollections)
	collectionApi.Get("/:id", handlers.GetCollection)
	collectionApi.Patch("/:id", handlers.UpdateCollection)
}
