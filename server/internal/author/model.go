package author

type Author struct {
	AuthorID    int            `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	ProfilePic  string         `json:"profile_pict"`
	Books       []BookResponse `json:"books"`
}

type BookResponse struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Cover string `json:"Cover"`
}
