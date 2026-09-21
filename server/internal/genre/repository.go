package genre

import "database/sql"

type Repository struct{ db *sql.DB }

func NewRepository(db *sql.DB) *Repository { return &Repository{db: db} }

func (r *Repository) FindAll() ([]Genre, error) {
	rows, err := r.db.Query(`SELECT genre_id, name FROM Genre ORDER BY name ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	genres := make([]Genre, 0)
	for rows.Next() {
		var g Genre
		rows.Scan(&g.ID, &g.Name)
		genres = append(genres, g)
	}
	return genres, nil
}

func (r *Repository) Create(req CreateGenreRequest) (int, error) {
	var id int
	err := r.db.QueryRow(`
        INSERT INTO Genre (name) VALUES ($1) RETURNING genre_id
    `, req.Name).Scan(&id)
	return id, err
}

func (r *Repository) GetGenreByID(genreID int) (Genre, error) {
	var genre Genre
	err := r.db.QueryRow(`
		SELECT genre_id, name 
		FROM Genre 
		WHERE genre_id = $1`, genreID).Scan(&genre.ID, &genre.Name)

	if err != nil {
		return genre, err
	}

	return genre, nil
}

func (r *Repository) GetGenreBooks(genreID int) ([]Book, error) {
	booksRows, err := r.db.Query(`
		SELECT b.book_id, b.title, b.cover
		FROM Genre g
		LEFT JOIN BookGenre bg 
		ON bg.book_genre_id = g.genre_id
		LEFT JOIN book b
		ON b.book_id = bg.book_genre_id
		WHERE g.genre_id = $1`, genreID)

	if err != nil {
		return nil, err
	}
	defer booksRows.Close()

	genreBooks := make([]Book, 0)
	for booksRows.Next() {
		var g Book
		booksRows.Scan(&g.BookID, &g.Title, &g.Cover)
		genreBooks = append(genreBooks, g)
	}

	return genreBooks, nil
}
