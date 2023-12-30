package invites

import (
	"log"
	database "music_buddy/services/invites/database"
	models "music_buddy/services/invites/models"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func CreateInvite(c *fiber.Ctx) error {
	invite := new(models.Invite)

	if err := c.BodyParser(invite); err != nil {
		log.Println(err)
		return c.Status(400).JSON(fiber.Map{"message": "failed to parse input", "error": err.Error()})
	}

	validate := validator.New()

	if err := validate.Struct(invite); err != nil {
		log.Println(err)
		return c.Status(401).JSON(fiber.Map{"message": "failed to validate input", "error": err.Error()})
	}

	db := database.DB

	// find all the invites by sender
	// check whether receiver already exists or not

	var invites []models.Invite

	db.Where("sender_id = ?", invite.SenderID).Find(&invites)

	if len(invites) > 0 {
		log.Println("Invite already exists")
		return c.Status(403).JSON(fiber.Map{"message": "invite already exists", "error": "invite already exists"})
	}

	if err := db.Create(&invite).Error; err != nil {
		log.Println(err)
		return c.Status(500).JSON(fiber.Map{"message": "failed to create invite", "error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "invite created", "results": invite})
}

func AcceptInvite(c *fiber.Ctx) error {
	inviteId := c.Params("id")
	db := database.DB

	var invite models.Invite

	if err := db.Find(&invite, inviteId).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to get invite", "error": err.Error()})
	}

	if err := db.Delete(&invite).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to accept invite", "error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "invite accepted", "results": nil})
}

func GetAllInvites(c *fiber.Ctx) error {
	db := database.DB
	var invites []models.Invite
	if err := db.Find(&invites).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to get invites", "error": err.Error()})
	}
	return c.Status(200).JSON(fiber.Map{"message": "invites found", "results": invites})
}