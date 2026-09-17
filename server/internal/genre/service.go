package genre

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(req CreateGenreRequest) (int, error) {
	return s.repo.Create(req)
}

func (s *Service) FindAll() ([]Genre, error) {
	return s.repo.FindAll()
}
