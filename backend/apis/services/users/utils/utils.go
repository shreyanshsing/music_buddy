package users

func ReverseSlice(s []string) []string {
    length := len(s)
    reversed := make([]string, length)
    for i, item := range s {
        reversed[length-1-i] = item
    }
    return reversed
}