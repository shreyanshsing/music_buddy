package socketsetup

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"github.com/gorilla/mux"
	"github.com/gofiber/fiber/v2"
	"github.com/gorilla/websocket"
)

var Upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func SetupServer() {
	r := mux.NewRouter()
    r.HandleFunc("/music_buddy/{userID}", HandleConnection)
    log.Fatal(http.ListenAndServe(":9988", r))
}

func HandleConnection(w http.ResponseWriter, r *http.Request) {

	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		conn.WriteJSON(fiber.Map{"message": "Error upgrading connection", "type": "error"})
		return
	}
	vars := mux.Vars(r)
    userID := vars["userID"]

	connections[userID] = conn

	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			conn.WriteJSON(fiber.Map{"message": "Error reading message", "type": "error"})
			return
		}
		var msg map[string]interface{}

		err = json.Unmarshal(message, &msg)
		if err != nil {
			log.Printf("Error decoding JSON: %v", err)
			conn.WriteJSON(fiber.Map{"message": "Error decoding JSON", "type": "error"})
			return
		}

		fmt.Println("Received message:", msg)

		if msg["type"] == "send-invite" {
			// create an invite
			invite := map[string]interface{}{
				"receiver_id": msg["receiver_id"],
				"sender_id":   msg["sender_id"],
			}
			SendInvite(conn, invite)
		}
	}
}

var connections map[string]*websocket.Conn = make(map[string]*websocket.Conn)

func sendMessageBackToClient(conn *websocket.Conn, message map[string]interface{}) {
	conn.WriteJSON(message)
}

func SendInvite(conn *websocket.Conn, invite map[string]interface{}) {
	jsonData, err := json.Marshal(invite)
	if err != nil {
		log.Printf("Error encoding JSON: %v", err)
		sendMessageBackToClient(conn, fiber.Map{"message": "Error encoding JSON", "type": "error"})
		return
	}
	log.Println("Sending invite...", string(jsonData))
	client := &http.Client{}

	inviteReq := &http.Request{
		Method: "POST",
		URL: &url.URL{
			Scheme: "http",
			Host:   "localhost:8080",
			Path:   "/api/v0/invites",
		},
		Body: io.NopCloser(bytes.NewBuffer(jsonData)),
		Header: http.Header{
			"Content-Type": []string{"application/json"},
		},
	}

	inviteRes, err := client.Do(inviteReq)
	log.Println("Invite Response:", inviteRes)
	if err != nil {
		log.Printf("Error sending POST request: %v", err)
		sendMessageBackToClient(conn, fiber.Map{"message": "Error sending POST request", "type": "error"})
		return
	}
	defer inviteRes.Body.Close()

	// Read the body of the response
	inviteResBody, err := io.ReadAll(inviteRes.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		sendMessageBackToClient(conn, fiber.Map{"message": "Error reading body", "type": "error"})
		return
	}

	// Define a struct to hold the response data
	type ResponseData struct {
		Results map[string]interface{} `json:"results"`
	}

	// Unmarshal the JSON
	var data ResponseData
	err = json.Unmarshal(inviteResBody, &data)
	if err != nil {
		log.Printf("Error unmarshaling JSON: %v", err)
		sendMessageBackToClient(conn, fiber.Map{"message": "Error unmarshaling JSON", "type": "error"})
		return
	}

	inviteId, ok := data.Results["ID"]
	if !ok {
		log.Println("ID not found in results")
		sendMessageBackToClient(conn, fiber.Map{"message": "ID not found in results", "type": "error"})
		return
	}

	userReqBody := map[string]interface{}{
		"send_invite": fmt.Sprintf("%v", inviteId),
	}

	log.Println("userReqBody---", userReqBody)

	userReqBodyData, err := json.Marshal(userReqBody)

	if err != nil {
		log.Printf("Error encoding JSON: %v", err)
		sendMessageBackToClient(conn, fiber.Map{"message": "Error encoding JSON", "type": "error"})
		return
	}

	userReq := &http.Request{
		Method: "PATCH",
		URL: &url.URL{
			Scheme: "http",
			Host:   "localhost:8080",
			Path:   fmt.Sprintf("/api/v0/user/%s", invite["sender_id"].(string)),
		},
		Body:   io.NopCloser(bytes.NewBuffer(userReqBodyData)),
		Header: inviteRes.Request.Header,
	}

	userRes, err := client.Do(userReq)
	log.Println("user Response:", userRes)
	if err != nil {
		log.Printf("Error sending PATCH request: %v", err)
		sendMessageBackToClient(conn, fiber.Map{"message": "Error sending PATCH request", "type": "error"})
		return
	}

	defer userRes.Body.Close()
	defer sendMessageBackToClient(conn, fiber.Map{"message": "Invite sent", "type": "success"})
	defer func() {
		if (connections[invite["receiver_id"].(string)] != nil) {
			sendMessageBackToClient(connections[invite["receiver_id"].(string)], fiber.Map{"message": "Invitation Received", "sender_id": invite["sender_id"], "type": "invite"})
		}
	}()
}
