package author

import "server/internal/book"

type Author struct {
	AuthorID    int         `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	ProfilePic  string      `json:"profile_pict"`
	Books       []book.Book `json:"books"`
}
