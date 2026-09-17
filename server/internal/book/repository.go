package book

import (
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll() ([]Book, error) {
	rows, err := r.db.Query(`SELECT book_id, title, price, year, page, language, description, cover FROM book ORDER BY title asc`)
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

func (r *Repository) FindByID(id int) (Book, error) {
	var b Book

	err := r.db.QueryRow(`
        SELECT book_id, title, price, year, page, language, description, cover
        FROM book
        WHERE book_id = $1
    `, id).Scan(
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
		return Book{}, err
	}

	genres, err := r.FindGenresByBookID(b.BookID)
	if err != nil {
		return Book{}, err
	}

	b.Genres = genres

	authors, err := r.FindAuthorsByBookID(b.BookID)
	if err != nil {
		return Book{}, err
	}

	b.Authors = authors

	return b, nil
}
func (r *Repository) FindGenresByBookID(id int) ([]GenreResponse, error) {
	rows, err := r.db.Query(`SELECT g.genre_id, g.name 
							FROM Genre g
							JOIN BookGenre bg ON bg.book_genre_id = g.genre_id
							WHERE bg.book_id = $1`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	genres := make([]GenreResponse, 0)
	for rows.Next() {
		var genre GenreResponse

		if err := rows.Scan(
			&genre.ID,
			&genre.Name,
		); err != nil {
			return nil, err
		}

		genres = append(genres, genre)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return genres, nil
}
func (r *Repository) FindAuthorsByBookID(id int) ([]AuthorResponse, error) {
	rows, err := r.db.Query(`SELECT a.author_id, a.name 
							FROM Author a
							JOIN AuthorBook ab ON ab.author_id = a.author_id
							WHERE ab.book_id = $1`, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var authors []AuthorResponse
	for rows.Next() {
		var author AuthorResponse
		if err := rows.Scan(&author.ID, &author.Name); err != nil {
			return nil, err
		}
		authors = append(authors, author)
	}
	return authors, nil
}

func (r *Repository) SearchBooks(query string) ([]Book, error) {
	rows, err := r.db.Query(`
	SELECT book_id, title, cover
	FROM book
	WHERE title ILIKE '%'||$1||'%'`, query)

	if err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []Book
	books = make([]Book, 0)
	for rows.Next() {
		var book Book

		err := rows.Scan(
			&book.BookID,
			&book.Title,
			&book.Cover,
		)

		if err != nil {
			return nil, err
		}

		books = append(books, book)
	}
	return books, nil
}
func (r *Repository) GetTrendingBooks() ([]Book, error) {
	rows, err := r.db.Query(`
        SELECT
            b.book_id,
            b.title,
            b.cover,
            COUNT(DISTINCT ub.user_id) AS reader_count
        FROM Book b
        JOIN UserBook ub
            ON ub.book_id = b.book_id
        WHERE ub.logged_at >= NOW() - INTERVAL '30 days'
        GROUP BY
            b.book_id,
            b.title,
            b.cover
        ORDER BY reader_count DESC
        LIMIT 10;
    `)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	books := make([]Book, 0)

	for rows.Next() {
		var book Book
		var readerCount int

		err := rows.Scan(
			&book.BookID,
			&book.Title,
			&book.Cover,
			&readerCount,
		)

		if err != nil {
			return nil, err
		}

		books = append(books, book)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return books, nil
}

func (r *Repository) Create(req CreateBookRequest, cover string) (int, error) {
	// mulai transaction
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback() // rollback kalau gagal

	// insert buku
	var bookID int
	err = tx.QueryRow(`
        INSERT INTO Book (title, price, year, page, language, description, cover)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING book_id
    `, req.Title, req.Price, req.Year, req.Page, req.Language, req.Description, cover).Scan(&bookID)
	if err != nil {
		return 0, err
	}

	// insert author relations
	for _, authorID := range req.AuthorIDs {
		_, err = tx.Exec(`
            INSERT INTO AuthorBook (author_id, book_id) VALUES ($1, $2)
        `, authorID, bookID)
		if err != nil {
			return 0, err
		}
	}

	// insert genre relations
	for _, genreID := range req.GenreIDs {
		_, err = tx.Exec(`
            INSERT INTO BookGenre (book_id, genre_id) VALUES ($1, $2)
        `, bookID, genreID)
		if err != nil {
			return 0, err
		}
	}

	// commit
	if err := tx.Commit(); err != nil {
		return 0, err
	}

	return bookID, nil
}

func (r *Repository) Delete(id int) (int, error) {
	var deletedID int
	err := r.db.QueryRow(`
        DELETE FROM book
        WHERE book_id = $1
		RETURNING book_id
    `, id).Scan(&deletedID)

	if err != nil {
		return 0, err
	}
	return deletedID, nil
}

func (r *Repository) Update(id int, req CreateBookRequest, cover string) (int, error) {
	// start transaction
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// update
	var bookID int
	query := `	
		UPDATE book
		SET title = $1, 
		    price = $2, 
		    year = $3, 
		    page = $4, 
		    language = $5, 
		    description = $6, 
		    cover = CASE WHEN $7 = '' THEN cover ELSE $7 END
		WHERE book_id = $8
        RETURNING book_id
	`

	err = tx.QueryRow(query, req.Title, req.Price, req.Year, req.Page, req.Language, req.Description, cover, id).Scan(&bookID)
	if err != nil {
		return 0, err
	}

	// delete original author relations
	_, err = tx.Exec(`DELETE FROM AuthorBook WHERE book_id = $1`, bookID)
	if err != nil {
		return 0, err
	}

	// insert author relations
	for _, authorID := range req.AuthorIDs {
		_, err = tx.Exec(`
            INSERT INTO AuthorBook (author_id, book_id) VALUES ($1, $2)
        `, authorID, bookID)
		if err != nil {
			return 0, err
		}
	}

	// delete original genre relations
	_, err = tx.Exec(`DELETE FROM BookGenre WHERE book_id = $1`, bookID)
	if err != nil {
		return 0, err
	}

	// insert genre relations
	for _, genreID := range req.GenreIDs {
		_, err = tx.Exec(`
            INSERT INTO BookGenre (book_id, genre_id) VALUES ($1, $2)
        `, bookID, genreID)
		if err != nil {
			return 0, err
		}
	}

	// commit
	if err := tx.Commit(); err != nil {
		return 0, err
	}

	return bookID, nil
}
