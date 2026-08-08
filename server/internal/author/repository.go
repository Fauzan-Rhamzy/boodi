package author

import "database/sql"

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindByID(id int) (*Author, error) {
	var a Author
	query := `SELECT author_id, name, description, profile_pict FROM author WHERE author_id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&a.AuthorID,
		&a.Name,
		&a.Description,
		&a.ProfilePic,
	)

	if err != nil {
		return nil, err
	}

	return &a, nil
}
