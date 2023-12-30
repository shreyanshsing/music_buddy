package collection

import (
	"log"
	database "music_buddy/services/collections/database"
	models "music_buddy/services/collections/models"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func CreateCollection(c *fiber.Ctx) error {
	input := new(models.Collection)

	if err := c.BodyParser(input); err != nil {
		log.Println(err)
		return c.Status(400).JSON(fiber.Map{"message": "failed to parse input", "error": err.Error()})
	}
	// validate input
	validate := validator.New()
	if err := validate.Struct(input); err != nil {
		log.Println(err)
		return c.Status(400).JSON(fiber.Map{"message": "failed to validate input", "error": err.Error()})
	}
	db := database.DB

	
	if err := db.Create(input).Error; err != nil {
		log.Println(err)
		return c.Status(500).JSON(fiber.Map{"message": "failed to create collection", "error": err.Error()})
	}
	dto, err := input.ToDTO()
	
	if err != nil {
		log.Println(err)
		return c.Status(400).JSON(fiber.Map{"message": "failed to create collection", "error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "collection created", "data": dto})
}

func GetAllCollections(c *fiber.Ctx) error {
	// TODO: use c.locals to get userID via auth middleware
	filters := c.Queries()

	if filters["user_id"] == "" {
		log.Println("user_id is missing")
		return c.Status(400).JSON(fiber.Map{"message": "user_id is required", "error": nil})
	}

	db := database.DB
	var collections []models.Collection

	db = db.Where("created_by = ?", filters["user_id"])

	if filters["name"] != "" {
		db = db.Where("name LIKE ?", "%"+filters["name"]+"%")
	}

	offset, _ := strconv.Atoi(c.Query("offset", "0"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	db = db.Offset(offset).Limit(limit)

	if err := db.Find(&collections).Error; err != nil {
		log.Println(err)
		return c.Status(404).JSON(fiber.Map{"message": "failed to get collections", "error": err.Error()})
	}

	dtoCollections := make([]models.CollectionDTO, len(collections))
	for i, collection := range collections {
		dto, err := collection.ToDTO()
		if err != nil {
			log.Println(err)
			return c.Status(500).JSON(fiber.Map{"message": "failed to convert collection to DTO", "error": err.Error()})
		}
		dtoCollections[i] = dto
	}
	
	return c.Status(200).JSON(fiber.Map{"message": "collections found", "data": dtoCollections})
}

func GetCollection(c *fiber.Ctx) error {
	// TODO: use c.locals to get userID via auth middleware
	filters := c.Queries()

	if filters["user_id"] == "" {
		return c.Status(400).JSON(fiber.Map{"message": "user_id is required", "error": nil})
	}
	db := database.DB
	db = db.Where("created_by = ?", filters["user_id"])
	var collection models.Collection
	if err := db.First(&collection, c.Params("id")).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"message": "failed to get collection", "error": err.Error()})
	}

	dto, err := collection.ToDTO()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to convert collection to DTO", "error": err.Error()})
	}
	return c.Status(200).JSON(fiber.Map{"message": "collection found", "data": dto})
}

func UpdateCollection(c *fiber.Ctx) error {
	type updateCollectionInput struct {
		Name string `json:"name"`
		LinkURLs []string `json:"link_urls"`
		ShareWith []string `json:"share_with"`
		ProfileURL string `json:"profile_url"`
		RemoveLink string `json:"remove_link"`
		RemoveSharedWith string `json:"remove_shared_with"`
		RemoveProfileURL bool `json:"remove_profile_url"`
	}

	input := new(updateCollectionInput)

	if err := c.BodyParser(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "failed to parse input", "error": err.Error()})
	}
	
	id := c.Params("id")
	
	var collection models.Collection

	db := database.DB

	if err := db.First(&collection, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"message": "failed to get collection", "error": err.Error()})
	}

	if input.Name != "" {
		collection.AddName(input.Name)
	}

	if input.LinkURLs != nil {
		for _, url := range input.LinkURLs {
			if err := collection.AddLinkedURL(url); err != nil {
				log.Println(err)
				return c.Status(500).JSON(fiber.Map{"message": "failed to update collection", "error": err.Error()})
			}
		}
	}

	if input.ShareWith != nil {
		for _, user := range input.ShareWith {
			if err := collection.AddSharedWith(user); err != nil {
				return c.Status(500).JSON(fiber.Map{"message": "failed to update collection", "error": err.Error()})
			}
		}
	}

	if input.ProfileURL != "" {
		collection.AddProfileURL(input.ProfileURL)
	}

	if input.RemoveLink != "" {
		if err := collection.RemoveLinkedURL(input.RemoveLink); err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "failed to update collection", "error": err.Error()})
		}
	}

	if input.RemoveSharedWith != "" {
		if err := collection.RemoveSharedWith(input.RemoveSharedWith); err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "failed to update collection", "error": err.Error()})
		}
	}

	if input.RemoveProfileURL {
		collection.RemoveProfileURL()
	}

	if err := db.Updates(&collection).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to update collection", "error": err.Error()})
	}

	dto, err := collection.ToDTO()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to convert collection to DTO", "error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "collection updated", "data": dto})
}