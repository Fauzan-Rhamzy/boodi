package genre

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CreateGenreRequest struct {
	Name string `json:"name"`
}

type Book struct {
	BookID *int    `json:"id"`
	Title  *string `json:"title"`
	Year   *int    `json:"year"`
	Cover  *string `json:"cover"`
}

type GenreBooks struct {
	genre Genre  `json:"genre"`
	book  []Book `json:"books"`
}
