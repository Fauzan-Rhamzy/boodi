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
			b.cover as book_cover,
			r.rating,
			u.user_id,
			u.first_name,
			u.last_name,
			u.profile_pic as user_pic,
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
			b.cover ,
			r.rating,
			u.user_id,
			u.first_name,
			u.last_name,
			u.profile_pic ,
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
			&review.UserID,
			&review.FirstName,
			&review.LastName,
			&review.ProfilePic,
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
func (r *Repository) GetBookReviews(userID int, bookID int) ([]BookReview, error) {
	rows, err := r.db.Query(`
		SELECT
			r.review_id,
			r.book_id,
			r.rating,
			u.user_id,
			u.first_name,
			u.last_name,
			u.profile_pic as user_pic,
			r.comment,
			COUNT(DISTINCT l.like_id) AS like_count,
			EXISTS (
				SELECT 1
				FROM Likes my_like
				WHERE my_like.review_id = r.review_id
				AND my_like.user_id = $1
			) AS is_liked,
			COUNT(DISTINCT re.reply_id) AS reply_count
		FROM Review r
		JOIN Users u
			ON r.user_id = u.user_id
		LEFT JOIN Likes l
			ON r.review_id = l.review_id
		LEFT JOIN Reply re
			ON r.review_id = re.review_id
		WHERE r.book_id = $2
		GROUP BY
			r.review_id,
			r.book_id,
			r.rating,
			u.user_id,
			u.first_name,
			u.last_name,
			u.profile_pic ,
			r.comment
		ORDER BY r.review_id DESC
	`, userID, bookID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []BookReview

	for rows.Next() {
		var review BookReview

		err := rows.Scan(
			&review.ReviewID,
			&review.BookID,
			&review.Rating,
			&review.UserID,
			&review.FirstName,
			&review.LastName,
			&review.ProfilePic,
			&review.Comment,
			&review.LikeCount,
			&review.IsLiked,
			&review.ReplyCount,
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

func (r *Repository) GetBookRating(bookID int) (*RatingSummaryResponse, error) {
    rows, err := r.db.Query(`
        SELECT
            stars.rating,
            COUNT(r.review_id) AS count
        FROM generate_series(1, 5) AS stars(rating)
        LEFT JOIN Review r
            ON r.rating = stars.rating
            AND r.book_id = $1
        GROUP BY stars.rating
        ORDER BY stars.rating DESC
    `, bookID)

    if err != nil {
        return nil, err
    }
    defer rows.Close()

    ratings := make([]RatingSummary, 0)

    for rows.Next() {
       var rating RatingSummary

        err := rows.Scan(
            &rating.Rating,
            &rating.Count,
        )

        if err != nil {
            return nil, err
        }

        ratings = append(ratings, rating)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    var average float64
    var total int

    err = r.db.QueryRow(`
        SELECT
            COALESCE(AVG(rating), 0),
            COUNT(*)
        FROM Review
        WHERE book_id = $1
    `, bookID).Scan(&average, &total)

    if err != nil {
        return nil, err
    }

    for i := range ratings {
        if total > 0 {
            ratings[i].Percentage =
                float64(ratings[i].Count) / float64(total) * 100
        }
    }

    return &RatingSummaryResponse{
        Average:    average,
        Total:      total,
        Ratings:    ratings,
    }, nil
}

func (r *Repository) GetUserReviews(userID int) ([]TrendingReview, error) {
	rows, err := r.db.Query(`
		SELECT
			r.review_id,
			r.book_id,
			b.title,
			b.cover as book_cover,
			r.rating,
			u.user_id,
			u.first_name,
			u.last_name,
			u.profile_pic as user_pic,
			r.comment,
			COUNT(DISTINCT l.like_id) AS like_count,
			EXISTS (
				SELECT 1
				FROM Likes my_like
				WHERE my_like.review_id = r.review_id
				AND my_like.user_id = $1
			) AS is_liked
		FROM Review r
		JOIN Users u
			ON r.user_id = u.user_id
		LEFT JOIN Book b
			ON r.book_id = b.book_id
		LEFT JOIN Likes l
			ON r.review_id = l.review_id
		LEFT JOIN Reply re
			ON r.review_id = re.review_id
		WHERE r.user_id=$1
		GROUP BY
			r.review_id,
			r.book_id,
			b.title,
			b.cover,
			r.rating,
			u.user_id,
			u.first_name,
			u.last_name,
			u.profile_pic ,
			r.comment
		ORDER BY r.review_id DESC
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
			&review.UserID,
			&review.FirstName,
			&review.LastName,
			&review.ProfilePic,
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
