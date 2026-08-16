package user

import (
	"database/sql"
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
