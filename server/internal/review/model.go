package review

type TrendingReview struct {
	ReviewID  int    `json:"review_id"`
	BookCover string `json:"book_cover"`
	Rating    int    `json:"rating"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Comment   string `json:"comment"`
	LikeCount int    `json:"like_count"`
}