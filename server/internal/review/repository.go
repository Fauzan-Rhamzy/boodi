package review

import "database/sql"

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetTrendingReviews(userID int) ([]TrendingReview, error) {
	rows, err := r.db.Query(`
		SELECT
			r.review_id,
			b.book_id,
			b.title,
			b.cover,
			r.rating,
			u.first_name,
			u.last_name,
			r.comment,
			COUNT(l.like_id) AS like_count,
			EXISTS (
				SELECT 1
				FROM Likes my_like
				WHERE my_like.review_id = r.review_id
				AND my_like.user_id = $1
			) AS is_liked
		FROM Review r
		JOIN Book b
			ON r.book_id = b.book_id
		JOIN Users u
			ON r.user_id = u.user_id
		LEFT JOIN Likes l
			ON r.review_id = l.review_id
		GROUP BY
			r.review_id,
			b.book_id,
			b.title,
			b.cover,
			r.rating,
			u.first_name,
			u.last_name,
			r.comment
		ORDER BY like_count DESC
		LIMIT 3
	`, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []TrendingReview

	for rows.Next() {
		var review TrendingReview

		err := rows.Scan(
			&review.ReviewID,
			&review.BookID,
			&review.BookTitle,
			&review.BookCover,
			&review.Rating,
			&review.FirstName,
			&review.LastName,
			&review.Comment,
			&review.LikeCount,
			&review.IsLiked,
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