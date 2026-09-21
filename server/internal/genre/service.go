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

func (s *Service) GetGenreByID(genreID int) (Genre, error) {
	return s.repo.GetGenreByID(genreID)
}

func (s *Service) GetGenreBooks(genreID int) ([]Book, error) {
	return s.repo.GetGenreBooks(genreID)
}

// func (s *Service) GetGenreByName(genreName string) (Genre, error) {
// 	return s.repo.GetByName(genreName)
// }
