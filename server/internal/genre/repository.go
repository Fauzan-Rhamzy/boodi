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
