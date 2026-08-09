package book

type Book struct {
	BookID      int      `json:"id"`
	Title       string   `json:"title"`
	Price       float64  `json:"price"`
	Year        int      `json:"year"`
	Page        int      `json:"page"`
	Language    string   `json:"language"`
	Description string   `json:"description"`
	Cover       string   `json:"cover"`
	Genres      []string `json:"genres"`
	Authors     []string `json:"authors"`
}
