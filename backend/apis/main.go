package main

import (
	"log"
	"music_buddy/database"
	"music_buddy/ops/firebase-setup"
	socketsetup "music_buddy/ops/socket-setup"
	"music_buddy/router"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	app.Use(cors.New())
	
	// connect to all databases
	database.ConnectToAllDatabase()
	router.SetupRouter(app)

	// spwan a thread for socket
	go func() {
		socketsetup.SetupServer()
	}()

	if err := firebasesetup.SetupFirebase(); err != nil {
		println(err.Error())
		os.Exit(1)
	}
	err := app.Listen(":8080")

	if err != nil {
		log.Fatal(err)
		os.Exit(2)
	}
}