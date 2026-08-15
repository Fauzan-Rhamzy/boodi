package auth

import (
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindByEmail(email string) (*User, error) {
	var user User
	err := r.db.QueryRow(`SELECT user_id, email, password, role FROM users WHERE email = $1`, email).Scan(&user.ID, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) Create(req RegisterRequest, hashedPassword string) (int, error) {
	var id int
	err := r.db.QueryRow(`
	INSERT INTO users (email, password, first_name, last_name, phone)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING user_id
	`, req.Email, hashedPassword, req.FirstName, req.LastName, req.Phone).Scan(&id)
	return id, err
}

func (r *Repository) GetFirstName(userID int) (string, error) {
	var firstName string

	err := r.db.QueryRow(
		`SELECT first_name FROM Users WHERE user_id = $1`,
		userID,
	).Scan(&firstName)

	return firstName, err
}

func (r *Repository) GetProfilePicture(userID int) (string, error) {
	var profilePicture string

	err := r.db.QueryRow(
		`SELECT profile_pic FROM Users WHERE user_id = $1`,
		userID,
	).Scan(&profilePicture)

	return profilePicture, err
}
