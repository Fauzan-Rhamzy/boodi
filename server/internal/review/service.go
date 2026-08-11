package review

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetTrendingReviews() ([]TrendingReview, error) {
	return s.repo.GetTrendingReviews()
}