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
	err := r.db.QueryRow(`SELECT * FROM book WHERE id = $1`, id).Scan()
	if err != nil {
		return nil, err
	}
	return &b, nil
}
