package collection

import "database/sql"

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}
func (r *Repository) GetCurrentlyReading(userID int) ([]CurrentlyReadingBook, error) {
	rows, err := r.db.Query(`
		SELECT
			b.book_id,
			b.title,
			b.cover,
			ub.logged_at
		FROM UserBook ub
		JOIN Book b
			ON b.book_id = ub.book_id
		WHERE ub.user_id = $1
		AND ub.user_book_id IN (
			SELECT DISTINCT ON (book_id)
				user_book_id
			FROM UserBook
			WHERE user_id = $1
			ORDER BY book_id, logged_at DESC, user_book_id DESC
		)
		ORDER BY ub.logged_at DESC
	`, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	books := make([]CurrentlyReadingBook, 0)

	for rows.Next() {
		var book CurrentlyReadingBook

		if err := rows.Scan(
			&book.BookID,
			&book.Title,
			&book.Cover,
			&book.LoggedAt,
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

func (r *Repository) GetFavourite(userID int) ([]FavouriteBook, error) {
	rows, err := r.db.Query(`
		SELECT
			b.book_id,
			b.title,
			b.cover
		FROM Collection c
		JOIN BookCollection bc
			ON c.collection_id = bc.collection_id
		JOIN Book b
			ON b.book_id = bc.book_id
		WHERE c.user_id = $1
		AND c.name = 'Favorite'
		ORDER BY b.title ASC
	`, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	books := make([]FavouriteBook, 0)

	for rows.Next() {
		var book FavouriteBook

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

func (r *Repository) GetLibrary(
	userID int,
	collectionID int,
) (*LibraryResponse, error) {
	rows, err := r.db.Query(`
		SELECT
			c.collection_id,
			c.name,
			b.book_id,
			b.title,
			b.price,
			b.year,
			b.page,
			b.language,
			b.description,
			b.cover
		FROM Collection c
		LEFT JOIN BookCollection bc
			ON c.collection_id = bc.collection_id
		LEFT JOIN Book b
			ON b.book_id = bc.book_id
		WHERE c.collection_id = $1
		AND c.user_id = $2
		ORDER BY b.title ASC
	`, collectionID, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var library LibraryResponse
	library.Books = make([]Book, 0)

	for rows.Next() {
		var book Book

		err := rows.Scan(
			&library.CollectionID,
			&library.Name,
			&book.BookID,
			&book.Title,
			&book.Price,
			&book.Year,
			&book.Page,
			&book.Language,
			&book.Description,
			&book.Cover,
		)

		if err != nil {
			return nil, err
		}
		if book.BookID != 0 {
			library.Books = append(library.Books, book)
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &library, nil
}
