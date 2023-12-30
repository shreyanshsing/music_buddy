package users

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"log"
	"music_buddy/ops/mail"
	database "music_buddy/services/users/database"
	models "music_buddy/services/users/models"
	"strconv"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func GetAllUsers(c *fiber.Ctx) error {
	// create filter
	filters := c.Queries()
	log.Println("filters: ", filters)
	db := database.DB
	var users []models.User
	// apply filters
	if filters["user_name"] != "" {
		db = db.Where("user_name LIKE ?", "%"+filters["user_name"]+"%")
	}
	if filters["email"] != "" {
		db = db.Where("email LIKE ?", "%"+filters["email"]+"%")
	}
	if filters["name"] != "" {
		db = db.Where("name LIKE ?", "%"+filters["name"]+"%")
	}
	offset, _ := strconv.Atoi(c.Query("offset", "0"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	db = db.Offset(offset).Limit(limit)
	if err := db.Find(&users).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to get users", "error": err.Error()})
	}

	// convert users to dto
	usersDTO := make([]models.UserDTO, len(users))
	for i := 0; i < len(users); i++ {
		userDTO, err := users[i].ToDTO()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "failed to convert user to DTO", "error": err.Error()})
		}
		usersDTO[i] = userDTO
	}
	return c.Status(200).JSON(fiber.Map{"message": "all users", "results": users})
}

func GetUser(c *fiber.Ctx) error {

	id := c.Params("id")
	db := database.DB
	var user models.User

	if err := db.Find(&user, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to get user", "error": err.Error()})
	}

	if user.UserName == "" && user.Email == "" {
		return c.Status(404).JSON(fiber.Map{"message": "No user found with ID", "error": nil})
	}

	userDTO, err := user.ToDTO()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to convert user to DTO", "error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "user found", "results": userDTO})

}
func CreateUser(c *fiber.Ctx) error {
	user := new(models.User)
	// parse-input
	if err := c.BodyParser(user); err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to parse input", "error": err.Error()})
	}
	// validate input
	validate := validator.New()
	if err := validate.Struct(user); err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to validate input", "error": err.Error()})
	}
	// hash password
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to hash password", "error": err.Error()})
	}
	user.Password = hashedPassword
	db := database.DB

	if err := db.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to create user", "error": err.Error()})
	}

	subject := "Welcome to Music Buddy"
	body := "Welcome to Music Buddy, please click on the below link to activate your account. \n http://localhost:8080/activate/" + user.Email
	recieverMail := user.Email

	go func() {
		mail.SendMail(subject, body, recieverMail)
	}()

	userDTO, err := user.ToDTO()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to convert user to DTO", "error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "user created", "results": userDTO})
}

func UpdateUserProfile(c *fiber.Ctx) error {
	type UpdateUserInput struct {
		Password        string `json:"password"`
		ProfileURL      string `json:"profile_url"`
		SendInvite      string `json:"send_invite"`
		AcceptInvite    string `json:"accept_invite"`
		DeleteInvite    string `json:"delete_invite"`
		RecentlyWatched string `json:"recently_watched"`
		ClearWatchlist  bool   `json:"clear_watch_list"`
	}

	input := new(UpdateUserInput)

	if err := c.BodyParser(input); err != nil {
		log.Println(err)
		return c.Status(400).JSON(fiber.Map{"message": "failed to parse input", "error": err.Error()})
	}

	id := c.Params("id")

	db := database.DB

	var user models.User

	if err := db.Find(&user, id).Error; err != nil {
		log.Println(err)
		return c.Status(500).JSON(fiber.Map{"message": "failed to get user", "error": err.Error()})
	}

	// hash password
	if input.Password != "" {
		hashedPassword, err := hashPassword(input.Password)
		if err != nil {
			log.Println(err)
			return c.Status(500).JSON(fiber.Map{"message": "failed to hash password", "error": err.Error()})
		}
		user.ChangePassword(hashedPassword)
	}

	if input.ProfileURL != "" {
		user.UpdateProfileURL(input.ProfileURL)
	}

	if input.SendInvite != "" {
		user.AddInvite(input.SendInvite)
	}

	if input.RecentlyWatched != "" {
		user.AddRecentlyWatched(input.RecentlyWatched)
	}

	if input.ClearWatchlist {
		user.ClearWatchList()
	}

	log.Println("user---",user)

	if err := db.Updates(&user).Error; err != nil {
		log.Println(err)
		return c.Status(500).JSON(fiber.Map{"message": "failed to update user", "error": err.Error()})
	}

	userDTO, err := user.ToDTO()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to convert user to DTO", "error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "user updated", "results": userDTO})
}

func GetFriendsList(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB
	var user models.User

	userNameFilter := c.Query("user_name")

	if userNameFilter != "" {
		var users []models.User
		if err := db.Where("user_name LIKE ?", "%"+userNameFilter+"%").Find(&users).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "failed to get users", "error": err.Error()})
		}
		// convert users to dto
		usersDTO := make([]models.UserDTO, len(users))
		for i := 0; i < len(users); i++ {
			userDTO, err := users[i].ToDTO()
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"message": "failed to convert user to DTO", "error": err.Error()})
			}
			usersDTO[i] = userDTO
		}
		var ids []uint

		for _, userDTO := range usersDTO {
			ids = append(ids, userDTO.ID)
		}
		return c.Status(200).JSON(fiber.Map{"message": "friends list", "results": ids})
	}
	if err := db.Find(&user, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to get user", "error": err.Error()})
	}

	userDTO, err := user.ToDTO()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to convert user to DTO", "error": err.Error()})
	}
	return c.Status(200).JSON(fiber.Map{"message": "friends list", "results": userDTO.Friends})
}
