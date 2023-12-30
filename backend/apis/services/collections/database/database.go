package collection

import (
	collection "music_buddy/services/collections/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDatabase() {

	// connect to database
	db := sqlite.Open("bin/database/collections.db")
	gormDB, err := gorm.Open(db, &gorm.Config{})

	if err != nil {
		panic("Error connecting to gorm")
	}
	DB = gormDB
	gormDB.AutoMigrate(&collection.Collection{})
}
