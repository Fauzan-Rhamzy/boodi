package review

type TrendingReview struct {
	ReviewID  int    `json:"review_id"`
	BookID    string `json:"book_id"`
	BookTitle string `json:"title"`
	BookCover string `json:"cover"`
	Rating    int    `json:"rating"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Comment   string `json:"comment"`
	LikeCount int    `json:"like_count"`
	IsLiked   bool   `json:"is_liked"`
}