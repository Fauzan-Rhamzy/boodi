package book

type Book struct {
	BookID      int              `json:"id"`
	Title       string           `json:"title"`
	Price       float64          `json:"price"`
	Year        int              `json:"year"`
	Page        int              `json:"page"`
	Language    string           `json:"language"`
	Description string           `json:"description"`
	Cover       string           `json:"cover"`
	Genres      []GenreResponse  `json:"genres"`
	Authors     []AuthorResponse `json:"authors"`
}

type AuthorResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
type GenreResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
