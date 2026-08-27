package review

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetTrendingReviews(userID int) ([]TrendingReview, error) {
	return s.repo.GetTrendingReviews(userID)
}
func (s *Service) GetBookReviews(userID int, bookID int) ([]BookReview, error) {
	return s.repo.GetBookReviews(userID, bookID)
}