package collection

import "encoding/json"

func ParseStringToJSON(str string) ([]string, error) {

	if str == "" {
		return []string{}, nil
	}
	var urls []string
	err := json.Unmarshal([]byte(str), &urls)
	if err != nil {
		return nil, err
	}
	return urls, nil
}

func ParseJSONToString(array []string) (string, error) {
	if array == nil {
		return "", nil
	}
	jsonString, err := json.Marshal(array)
	if err != nil {
		return "", err
	}
	return string(jsonString), nil
}