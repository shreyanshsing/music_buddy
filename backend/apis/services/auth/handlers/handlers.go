package auth

import (
	"context"
	"log"
	"sync"
	"time"

	firebasesetup "music_buddy/ops/firebase-setup"
	userDatabase "music_buddy/services/users/database"
	userHandlers "music_buddy/services/users/handlers"
	userModels "music_buddy/services/users/models"

	"firebase.google.com/go/auth"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

const (
	SECRET_KEY = "secret"
)

func createFirebaseUser(email, password string) error {
	ctx := context.Background()
	client, err := firebasesetup.FirebaseApp.Auth(ctx)
	if err != nil {
		return err
	}

	params := (&auth.UserToCreate{}).
		Email(email).
		Password(password)

	_, err = client.CreateUser(ctx, params)
	if err != nil {
		return err
	}

	return nil
}

func generateJWTToken(email string) (string, error) {

	// Create the Claims
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Second * 60).Unix(), // Token expires after 60 seconds
		Issuer:    email,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(SECRET_KEY))
	return ss, err
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func validUser(email string, password string) (userModels.User, bool) {
	userDB := userDatabase.DB

	db := userDB.Where("email LIKE ?", "%"+email+"%")

	var user userModels.User

	if err := db.Find(&user).Error; err != nil {
		log.Println(err)
		return user, false
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err != nil {
		log.Println(err)
		return user, false
	}

	return user, true
}

func Login(c *fiber.Ctx) error {
	type UserInput struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}

	var userInput UserInput

	if err := c.BodyParser(&userInput); err != nil {
		log.Println(err)
		return c.Status(500).JSON(fiber.Map{"message": "failed to parse input", "error": err.Error()})
	}

	validate := validator.New()

	if err := validate.Struct(userInput); err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to validate input", "error": err.Error()})
	}

	// validate user by email and password
	// if valid, generate JWT token
	// return JWT token
	// validate user by email and password
	user, valid := validUser(userInput.Email, userInput.Password)
	if !valid {
		return c.Status(500).JSON(fiber.Map{"message": "no user exists with following credentials", "error": fiber.ErrBadRequest})
	}

	// generate JWT token
	token, err := generateJWTToken(userInput.Email)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to generate JWT token", "error": err.Error()})
	}

	userDTO, err := user.ToDTO()

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to convert user to DTO", "error": err.Error()})
	}

	return c.JSON(fiber.Map{"token": token, "message": "successfully logged in", "user": userDTO})
}

func Register(c *fiber.Ctx) error {
	type UserInput struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=6"`
		UserName string `json:"user_name" validate:"required"`
	}

	var userInput UserInput

	if err := c.BodyParser(&userInput); err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to parse input", "error": err.Error()})
	}

	validate := validator.New()

	if err := validate.Struct(userInput); err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to validate input", "error": err.Error()})
	}

	wg := sync.WaitGroup{}
	wg.Add(1)

	errChan := make(chan error, 1)

	go func() {
		defer wg.Done()
		if err := createFirebaseUser(userInput.Email, userInput.Password); err != nil {
			errChan <- err
		}
	}()

	wg.Wait()

	select {
	case err := <-errChan:
		return c.Status(500).JSON(fiber.Map{"message": "failed to create firebase user", "error": err.Error()})
	default:
		return userHandlers.CreateUser(c)
	}
}
