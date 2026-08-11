package review

import "database/sql"

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetTrendingReviews() ([]TrendingReview, error) {
	rows, err := r.db.Query(`
		SELECT
			r.review_id,
			b.cover AS book_cover,
			r.rating,
			u.first_name,
			u.last_name,
			r.comment,
			COUNT(l.like_id) AS like_count
		FROM Review r
		JOIN Book b
			ON r.book_id = b.book_id
		JOIN Users u
			ON r.user_id = u.user_id
		LEFT JOIN Likes l
			ON r.review_id = l.review_id
		GROUP BY
			r.review_id,
			b.cover,
			r.rating,
			u.first_name,
			u.last_name,
			r.comment
		ORDER BY like_count DESC
		LIMIT 3
	`)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []TrendingReview

	for rows.Next() {
		var review TrendingReview

		err := rows.Scan(
			&review.ReviewID,
			&review.BookCover,
			&review.Rating,
			&review.FirstName,
			&review.LastName,
			&review.Comment,
			&review.LikeCount,
		)

		if err != nil {
			return nil, err
		}

		reviews = append(reviews, review)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return reviews, nil
}