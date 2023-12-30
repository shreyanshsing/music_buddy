package invites

import "gorm.io/gorm"

type Invite struct {
	gorm.Model
	SenderID string `gorm:"not null" json:"sender_id" validate:"required"`
	ReceiverID string `gorm:"not null" json:"receiver_id" validate:"required"`
}