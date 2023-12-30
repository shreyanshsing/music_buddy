package router

import (
	auth "music_buddy/services/auth/router"
	collection "music_buddy/services/collections/router"
	invites "music_buddy/services/invites/router"
	user "music_buddy/services/users/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func SetupRouter(app *fiber.App) {

	//  Setup routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Music Buddy!")
	})

	apiEntryPoint := app.Group("/api/v0", logger.New(), cors.New())

	user.SetupRoutes(&apiEntryPoint)
	collection.SetupRoutes(&apiEntryPoint)
	auth.SetupRoutes(&apiEntryPoint)
	invites.SetupRoutes(&apiEntryPoint)
}
