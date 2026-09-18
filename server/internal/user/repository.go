package user

import (
	"database/sql"
	"errors"
	"fmt"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindByID(id int) (*User, error) {
	var u User
	err := r.db.QueryRow(`
		SELECT 
			user_id, first_name, last_name, email, phone, COALESCE(profile_pic, ''), role, joined_date
		FROM users 
		WHERE user_id = $1`, id).Scan(&u.UserID, &u.FirstName, &u.LastName, &u.Email, &u.Phone, &u.ProfilePic, &u.Role, &u.JoinedDate)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *Repository) Update(id int, req UpdateProfileRequest) error {
	if req.PicPath != "" {
		_, err := r.db.Exec(`
			UPDATE users
			SET first_name = $1, last_name = $2, phone = $3, profile_pic = $4
			WHERE user_id = $5
		`, req.FirstName, req.LastName, req.Phone, req.PicPath, id)
		return err
	}

	_, err := r.db.Exec(`
		UPDATE users
		SET first_name = $1, last_name = $2, phone = $3
		WHERE user_id = $4
	`, req.FirstName, req.LastName, req.Phone, id)
	return err
}

func (r *Repository) TrackBookProgress(userId int, bookId int, req TrackBookProgress) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	req.UserID = userId
	req.BookID = bookId

	var maxPage int
	err = tx.QueryRow(`
		SELECT page 
		FROM Book WHERE book_id = $1`, req.BookID).Scan(&maxPage)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New("Book not found!")
		}
		return err
	}

	if req.PagesRead > maxPage {
		return fmt.Errorf("page number (%d) exceeds total book pages (%d)", req.PagesRead, maxPage)
	}

	// insert baru tiap track progress
	_, err = tx.Exec(`
		INSERT INTO UserBook (user_id, book_id, current_page, logged_at)
		VALUES ($1, $2, $3, NOW())`, req.UserID, req.BookID, req.PagesRead)

	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *Repository) GetUserBookProgress(userID int, bookID int) (int, error) {
	var currentPage int
	query := `SELECT current_page FROM UserBook WHERE user_id = $1 AND book_id = $2 ORDER BY logged_at DESC LIMIT 1`

	err := r.db.QueryRow(query, userID, bookID).Scan(&currentPage)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, nil
		}
		return 0, err
	}
	return currentPage, nil
}

func (r *Repository) GetReadingSessions(userID, year, month int) ([]ReadingSession, error) {
	rows, err := r.db.Query(`
        SELECT 
            ub.logged_at,
            ub.current_page,
            b.book_id,
            b.title,
            b.cover,
            b.page AS total_pages
        FROM UserBook ub
        JOIN Book b ON b.book_id = ub.book_id
        WHERE ub.user_id = $1
        AND EXTRACT(YEAR FROM ub.logged_at) = $2
        AND EXTRACT(MONTH FROM ub.logged_at) = $3
        ORDER BY ub.logged_at DESC
    `, userID, year, month)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	sessions := make([]ReadingSession, 0)
	for rows.Next() {
		var s ReadingSession
		if err := rows.Scan(
			&s.LoggedAt,
			&s.CurrentPage,
			&s.BookID,
			&s.Title,
			&s.Cover,
			&s.TotalPages,
		); err != nil {
			return nil, err
		}
		sessions = append(sessions, s)
	}
	return sessions, nil
}
