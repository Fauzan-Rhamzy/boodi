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
	_, err := r.db.Exec(`
		UPDATE users
		SET first_name = $1, last_name = $2, phone = $3, profile_pic = $4	WHERE user_id = $5
	`, req.FirstName, req.LastName, req.Phone, req.PicPath, id)
	return err
}

func (r *Repository) TrackBookProgress(userId int, bookId int, req TrackBookProgress) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

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

	// Cek apakah udah ada di UserBook
	var currPage int
	err = tx.QueryRow(`
		SELECT 
			current_page
		FROM UserBook 
		WHERE user_id = $1 AND book_id = $1`, req.UserID, req.BookID).Scan(&currPage)

	if currPage+req.PagesRead > maxPage {
		return fmt.Errorf("input is (%d) more than book page (%d)", currPage+req.PagesRead, maxPage)
	}

	// kalo belom ada di UserBook, insert baru
	if errors.Is(err, sql.ErrNoRows) {
		_, err := tx.Exec(`
			INSERT INTO UserBook (user_id, book_id, current_page, logged_at)
			VALUES ($1, $2, $3, NOW())`, req.UserID, req.BookID, req.PagesRead, req.ReadDate)

		if err != nil {
			return err
		}
	} else if err != nil {
		return err
		// kalo udah ada, update buku yang udah ada di UserBook
	} else {
		_, err := tx.Exec(`
			UPDATE UserBook 
			SET current_page = current_page + $1, logged_at = NOW() WHERE user_id = $2 AND book_id = $3`, req.PagesRead, req.ReadDate, req.UserID, req.BookID)

		if err != nil {
			return err
		}
	}

	//update ke reading history
	_, err = tx.Exec(`
		INSERT INTO ReadingHistory (user_id, book_id, pages_read, read_date)
		VALUES ($1, $2, $3, $4)`, req.UserID, req.BookID, req.PagesRead, req.ReadDate)

	if err != nil {
		return err
	}

	return tx.Commit()
}
