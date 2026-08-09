package book

import "database/sql"

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll() ([]Book, error) {
	rows, err := r.db.Query(`SELECT book_id, title, price, year, page, language, description, cover FROM book`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []Book
	for rows.Next() {
		var b Book
		rows.Scan(
			&b.BookID,
			&b.Title,
			&b.Price,
			&b.Year,
			&b.Page,
			&b.Language,
			&b.Description,
			&b.Cover,
		)
		books = append(books, b)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return books, nil
}

func (r *Repository) FindByID(id int) (*Book, error) {
	var b Book
	err := r.db.QueryRow(`SELECT book_id, title, price, year, page, language, description, cover FROM book WHERE book_id = $1`, id).Scan(
		&b.BookID,
		&b.Title,
		&b.Price,
		&b.Year,
		&b.Page,
		&b.Language,
		&b.Description,
		&b.Cover,
	)
	if err != nil {
		return nil, err
	}

	genres, err := r.FindGenresByBookID(b.BookID)
	if err != nil {
		return nil, err
	}
	b.Genres = genres

	authors, err := r.FindAuthorsByBookID(b.BookID)
	if err != nil {
		return nil, err
	}
	b.Authors = authors

	return &b, nil
}

func (r *Repository) FindGenresByBookID(id int) ([]string, error) {
	rows, err := r.db.Query(`SELECT g.name 
							FROM Genre g
							JOIN BookGenre bg ON bg.book_genre_id = g.genre_id
							WHERE bg.book_id = $1`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		genres = append(genres, name)
	}
	return genres, nil
}

func (r *Repository) FindAuthorsByBookID(id int) ([]string, error) {
	rows, err := r.db.Query(`SELECT a.name 
							FROM Author a
							JOIN AuthorBook ab ON ab.author_book_id = a.author_id
							WHERE ab.book_id = $1`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var authors []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		authors = append(authors, name)
	}
	return authors, nil
}
