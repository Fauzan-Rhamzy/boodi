package review

type TrendingReview struct {
	ReviewID   int    `json:"review_id"`
	BookID     int    `json:"book_id"`
	BookTitle  string `json:"title"`
	BookCover  string `json:"book_cover"`
	Rating     int    `json:"rating"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	ProfilePic string `json:"user_pic"`
	Comment    string `json:"comment"`
	LikeCount  int    `json:"like_count"`
	IsLiked    bool   `json:"is_liked"`
}

type BookReview struct {
	ReviewID   int    `json:"review_id"`
	BookID     int    `json:"book_id"`
	Rating     int    `json:"rating"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	ProfilePic string `json:"user_pic"`
	Comment    string `json:"comment"`
	LikeCount  int    `json:"like_count"`
	IsLiked    bool   `json:"is_liked"`
	ReplyCount int    `json:"reply_count"`
}
type RatingSummary struct {
	Rating     int     `json:"rating"`
	Count      int     `json:"count"`
	Percentage float64 `json:"percentage"`
}

type RatingSummaryResponse struct {
	Average float64         `json:"average"`
	Total   int             `json:"total"`
	Ratings []RatingSummary `json:"ratings"`
}