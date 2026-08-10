package author

import (
	"database/sql"
	"server/internal/book"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindByID(id int) (*Author, error) {
	var a Author
	query := `SELECT author_id, name, description, COALESCE(profile_pict, '') FROM Author WHERE author_id = $1`

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

func (r *Repository) FindBooksByAuthorID(id int) ([]book.Book, error) {
	rows, err := r.db.Query(`SELECT b.book_id, b.title, b.price, b.year, b.page, b.language, b.description, b.cover
							FROM Book b
							JOIN AuthorBook ab ON ab.book_id = b.book_id
							WHERE ab.author_id = $1`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []book.Book
	for rows.Next() {
		var b book.Book
		if err := rows.Scan(
			&b.BookID, &b.Title, &b.Price, &b.Year, &b.Page, &b.Language, &b.Description, &b.Cover,
		); err != nil {
			return nil, err
		}
		books = append(books, b)
	}
	return books, nil
}
