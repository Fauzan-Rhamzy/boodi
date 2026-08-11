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

func (r *Repository) SearchBooks(query string)([]Book, error){
	rows, err := r.db.Query(`
	SELECT book_id, title, cover
	FROM book
	WHERE title ILIKE '%'||$1||'%'`, query)

	if err != nil{
		return nil, err
	}
	if err := rows.Err(); err != nil {
    return nil, err
}
	defer rows.Close()

	var books []Book
	books = make([]Book, 0)
	for rows.Next(){
		var book Book

		err:= rows.Scan(
			&book.BookID,
			&book.Title,
			&book.Cover,
		)

		if err != nil{
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

func (r *Repository) GetCurrentlyReading(userID int) ([]Book, error) {
	rows, err := r.db.Query(`
		SELECT
			b.book_id,
			b.title,
			b.cover
		FROM UserBook ub
		JOIN Book b
			ON b.book_id = ub.book_id
		WHERE ub.user_id = $1
		  AND ub.current_page < b.page
		ORDER BY ub.logged_at DESC
		LIMIT 10
	`, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []Book
 	books = make([]Book, 0)

	for rows.Next() {
		var book Book

		if err := rows.Scan(
			&book.BookID,
			&book.Title,
			&book.Cover,
		); err != nil {
			return nil, err
		}

		books = append(books, book)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return books, nil
}