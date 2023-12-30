package collection

import (
	"log"
	utils "music_buddy/services/collections/utils"

	"gorm.io/gorm"
)

type Collection struct {
	gorm.Model
	Name string `gorm:"uniqueIndex; not null;" json:"name" validate:"required"`
	LinkedURLs string `gorm:"type:json" json:"linked_urls"`
	CreatedBy string `gorm:"not null; <-:create" json:"created_by" validate:"required"`
	SharedWith string `gorm:"type:json" json:"shared_with"`
	ProfileURL string `json:"profile_url"`
}

type CollectionDTO struct {
	ID             uint     `json:"id"`
    Name           string   `json:"name"`
    LinkedURLs     []string `json:"linked_urls"`
    ShareWith      []string `json:"share_with"`
    ProfileURL     string   `json:"profile_url"`
	CreatedBy      string   `json:"created_by"`
}

func (c *Collection) AddName(name string) {
	c.Name = name
}

func (c *Collection) AddLinkedURL(linkedURL string) error {
    urls, err := utils.ParseStringToJSON(c.LinkedURLs)
	if err != nil {
		return err
	}
    // Append the new URL
    urls = append(urls, linkedURL)

    // Serialize urls back into a JSON string
	updatedVal, err := utils.ParseJSONToString(urls)
	if err != nil {
		return err
	}
    c.LinkedURLs = updatedVal 
    return nil
}

func (c *Collection) AddSharedWith(sharedWith string) error {
    urls, err := utils.ParseStringToJSON(c.SharedWith)
	if err != nil {
		return err
	}
    // Append the new URL
    urls = append(urls, sharedWith)

    // Serialize urls back into a JSON string
	updatedVal, err := utils.ParseJSONToString(urls)
	if err != nil {
		return err
	}
    c.SharedWith = updatedVal 
    return nil
}

func (c *Collection) RemoveSharedWith(sharedWith string) error {
	urls, err := utils.ParseStringToJSON(c.SharedWith)
	if err != nil {
		return err
	}
	for i, url := range urls {
		if url == sharedWith {
			urls = append(urls[:i], urls[i+1:]...)
			break
		}
	}
	updatedVal, err := utils.ParseJSONToString(urls)
	if err != nil {
		return err
	}
	c.SharedWith = updatedVal
	return nil
}

func (c *Collection) RemoveLinkedURL(linkedURL string) error {
	urls, err := utils.ParseStringToJSON(c.LinkedURLs)
	if err != nil {
		return err
	}
	for i, url := range urls {
		if url == linkedURL {
			urls = append(urls[:i], urls[i+1:]...)
			break
		}
	}
	updatedVal, err := utils.ParseJSONToString(urls)
	if err != nil {
		return err
	}
	c.LinkedURLs = updatedVal
	return nil
}

func (c *Collection) AddProfileURL(profileURL string) {
	c.ProfileURL = profileURL
}

func (c *Collection) RemoveProfileURL() {
	c.ProfileURL = ""
}

func (c *Collection) ToDTO() (CollectionDTO, error) {

	linkedURLs, err := utils.ParseStringToJSON(c.LinkedURLs)

	if err != nil {
		log.Println(err)
		return CollectionDTO{}, err
	}

	sharedWith, err := utils.ParseStringToJSON(c.SharedWith)

	if err != nil {
		log.Println(err)
		return CollectionDTO{}, err
	}

    return CollectionDTO{
		ID:             c.ID,
        Name:           c.Name,
        LinkedURLs:     linkedURLs,
        ShareWith:      sharedWith,
        ProfileURL:     c.ProfileURL,
		CreatedBy:      c.CreatedBy,
    }, nil
}
