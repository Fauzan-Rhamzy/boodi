package collection

import "time"

type CurrentlyReadingBook struct {
	BookID   int       `json:"id"`
	Title    string    `json:"title"`
	Cover    string    `json:"cover"`
	LoggedAt time.Time `json:"logged_at"`
}

type FavouriteBooks struct {
	BookID int    `json:"id"`
	Title  string `json:"title"`
	Cover  string `json:"cover"`
}

type Book struct {
	BookID      *int              `json:"id"`
	Title       *string           `json:"title"`
	Price       *float64          `json:"price"`
	Year        *int              `json:"year"`
	Page        *int              `json:"page"`
	Language    *string           `json:"language"`
	Description *string           `json:"description"`
	Cover       *string           `json:"cover"`
	Genres      *[]string         `json:"genres"`
	Authors     *[]AuthorResponse `json:"authors"`
}
type AuthorResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type LibraryResponse struct {
	CollectionID int    `json:"id"`
	Name         string `json:"name"`
	Books        []Book `json:"books"`
}

type Collection struct {
	CollectionID int    `json:"collection_id"`
	Name         string `json:"name"`
	UserID       int    `json:"user_id"`
	CoverPhoto   string `json:"cover_photo"`
}

type CreateCollectionRequest struct {
	Name       string `json:"name"`
	CoverPhoto string `json:"cover_photo"`
}
