package genre

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CreateGenreRequest struct {
	Name string `json:"name`
}
