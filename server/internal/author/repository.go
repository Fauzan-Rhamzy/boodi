package author

import (
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll() ([]Author, error) {
	rows, err := r.db.Query(`
        SELECT author_id, name, description, profile_pic
        FROM Author
        ORDER BY name ASC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	authors := make([]Author, 0)
	for rows.Next() {
		var a Author
		if err := rows.Scan(&a.AuthorID, &a.Name, &a.Description, &a.ProfilePic); err != nil {
			return nil, err
		}
		authors = append(authors, a)
	}
	return authors, nil
}

func (r *Repository) Create(req CreateAuthorRequest) (int, error) {
	var id int
	err := r.db.QueryRow(`
        INSERT INTO Author (name)
        VALUES ($1)
        RETURNING author_id
    `, req.Name).Scan(&id)
	return id, err
}

func (r *Repository) FindByID(id int) (*Author, error) {
	var a Author
	query := `SELECT author_id, name, description, COALESCE(profile_pic, '') FROM Author WHERE author_id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&a.AuthorID,
		&a.Name,
		&a.Description,
		&a.ProfilePic,
	)

	if err != nil {
		return nil, err
	}

	books, err := r.FindBooksByAuthorID(a.AuthorID)
	if err != nil {
		return nil, err
	}
	a.Books = books

	return &a, nil
}

func (r *Repository) FindBooksByAuthorID(id int) ([]BookResponse, error) {
	rows, err := r.db.Query(`SELECT b.book_id, b.title, b.cover
							FROM Book b
							JOIN AuthorBook ab ON ab.book_id = b.book_id
							WHERE ab.author_id = $1`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []BookResponse
	for rows.Next() {
		var book BookResponse
		if err := rows.Scan(
			&book.ID, &book.Title, &book.Cover,
		); err != nil {
			return nil, err
		}
		books = append(books, book)
	}
	return books, nil
}
