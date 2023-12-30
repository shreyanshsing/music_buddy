package mail

import (
	"log"
	"gopkg.in/gomail.v2"
)

const (
	SMTP_PORT = 587
	SMTP_SERVER = "smtp.gmail.com"
	SENDER_EMAIL = "shreyanshsinghjee@gmail.com"
	SENDER_PASSWORD = "aanw kxve wjni xuxr"
)

func prepareMail(subject string, body string, recieverMail string) *gomail.Message {
	// Create an email message
	mail := gomail.NewMessage()
	mail.SetHeader("From", SENDER_EMAIL)
	mail.SetHeader("To", recieverMail)
	mail.SetHeader("Subject", subject)
	mail.SetBody("text/plain", body)
	return mail
}

func SendMail(subject string, body string, recieverMail string) error {
	
	log.Println("sending verification email...", subject, body, recieverMail)
	mailBody := prepareMail(subject, body, recieverMail)
	dailer := gomail.NewDialer(SMTP_SERVER, SMTP_PORT, SENDER_EMAIL, SENDER_PASSWORD)
	return dailer.DialAndSend(mailBody);
}