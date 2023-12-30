package users

import (
	"gorm.io/gorm"
	"log"
	utils "music_buddy/services/collections/utils"
	userUtils "music_buddy/services/users/utils"
)

type User struct {
	gorm.Model
	UserName        string `gorm:"uniqueIndex; not null; <-:create" json:"user_name" validate:"required"`
	Email           string `gorm:"uniqueIndex; not null; <-:create" json:"email" validate:"required,email"`
	Password        string `gorm:"not null; <-" json:"password" validate:"required"`
	ProfileURL      string `json:"profile_url"`
	Friends         string `gorm:"type:json" json:"friends"`
	Collections     string `gorm:"type:json" json:"collections"`
	RecentlyWatched string `gorm:"type:json" json:"recently_watched"`
	EmailVerified   bool   `gorm:"default:false" json:"email_verified"`
	Invites         string `gorm:"type:json" json:"invites"`
}

type UserDTO struct {
	ID              uint     `json:"id"`
	UserName        string   `json:"user_name"`
	Email           string   `json:"email"`
	ProfileURL      string   `json:"profile_url"`
	Friends         []string `json:"friends"`
	Collections     []string `json:"collections"`
	RecentlyWatched []string `json:"recently_watched"`
	EmailVerified   bool     `json:"email_verified"`
	Invites         []string `json:"invites"`
}

func (u *User) UpdateProfileURL(newProfileURL string) {
	u.ProfileURL = newProfileURL
}

func (u *User) ChangePassword(newPassword string) {
	u.Password = newPassword
}

func (u *User) AddInvite(inviteID string) error {
	// unmarshal the invites
	invites, err := utils.ParseStringToJSON(u.Invites)
	if err != nil {
		log.Println(err)
		return err
	}
	invites = append(invites, inviteID)

	// marshal the invites
	updatedVal, err := utils.ParseJSONToString(invites)
	if err != nil {
		log.Println(err)
		return err
	}
	// append the new invite
	u.Invites = updatedVal
	return nil
}

func (u *User) RemoveInvite(inviteID string) error {
	invites, err := utils.ParseStringToJSON(u.Invites)
	if err != nil {
		log.Println(err)
		return err
	}
	for i, invite := range invites {
		if invite == inviteID {
			invites = append(invites[:i], invites[i+1:]...)
			break
		}
	}
	updatedVal, err := utils.ParseJSONToString(invites)
	if err != nil {
		log.Println(err)
		return err
	}
	u.Invites = updatedVal
	return nil
}

func (u *User) AddRecentlyWatched(recentlyWatchedID string) error {
	// unmarshal the recently watched
	recentlyWatched, err := utils.ParseStringToJSON(u.RecentlyWatched)
	if err != nil {
		log.Println(err)
		return err
	}
	recentlyWatched = userUtils.ReverseSlice(recentlyWatched)

	log.Println(recentlyWatched)

	exists := false
	for _, id := range recentlyWatched {
		if id == recentlyWatchedID {
			exists = true
			break
		}
	}

	if exists {
		log.Println("recentlyWatchedID exists in the slice")
	} else {
		log.Println("recentlyWatchedID does not exist in the slice")
		if len(recentlyWatched) > 10 {
			recentlyWatched = recentlyWatched[1:]
			recentlyWatched = append(recentlyWatched, recentlyWatchedID)
		} else {
			recentlyWatched = append(recentlyWatched, recentlyWatchedID)
		}
	}
	// marshal the recently watched
	updatedVal, err := utils.ParseJSONToString(recentlyWatched)
	if err != nil {
		log.Println(err)
		return err
	}
	// append the new recently watched
	u.RecentlyWatched = updatedVal
	return nil
}

func (u *User) ClearWatchList() {
	u.RecentlyWatched = ""
}

func (u *User) ToDTO() (UserDTO, error) {

	friends, err := utils.ParseStringToJSON(u.Friends)

	if err != nil {
		log.Println(err)
		return UserDTO{}, err
	}

	collections, err := utils.ParseStringToJSON(u.Collections)

	if err != nil {
		log.Println(err)
		return UserDTO{}, err
	}

	recentlyWatched, err := utils.ParseStringToJSON(u.RecentlyWatched)

	if err != nil {
		log.Println(err)
		return UserDTO{}, err
	}

	invites, err := utils.ParseStringToJSON(u.Invites)

	if err != nil {
		log.Println(err)
		return UserDTO{}, err
	}

	return UserDTO{
		ID:              u.ID,
		UserName:        u.UserName,
		Email:           u.Email,
		ProfileURL:      u.ProfileURL,
		Friends:         friends,
		Collections:     collections,
		RecentlyWatched: recentlyWatched,
		EmailVerified:   u.EmailVerified,
		Invites:         invites,
	}, nil
}
