package firebasesetup

import (
	"context"
	"log"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

var FirebaseApp *firebase.App
  
func SetupFirebase() error {
	opt := option.WithCredentialsFile("ops/firebase-setup/serviceAccountKey.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return err
	}
	FirebaseApp = app
	log.Println("connected to firebase")
	return nil
}