package database

import (
	collection "music_buddy/services/collections/database"
	userDatabase "music_buddy/services/users/database"
	invites "music_buddy/services/invites/database"
)

func ConnectToAllDatabase() {

	// connect to user database
	userDatabase.ConnectToDatabase()
	collection.ConnectToDatabase()
	invites.ConnectToDatabase()
}
