package book

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll() ([]Book, error) {
	return s.repo.FindAll()
}

func (s *Service) GetByID(id int) (Book, error) {
	return s.repo.FindByID(id)
}
func (s *Service) SearchBooks(query string) ([]Book, error) {
	return s.repo.SearchBooks(query)
}
func (s *Service) GetTrendingBooks() ([]Book, error) {
	return s.repo.GetTrendingBooks()
}

func (s *Service) Create(req CreateBookRequest, filePath string) (int, error) {
	return s.repo.Create(req, filePath)
}

func (s *Service) Delete(id int) (int, error) {
	return s.repo.Delete(id)
}

func (s *Service) Update(id int, req CreateBookRequest, filePath string) (int, error) {
	return s.repo.Update(id, req, filePath)
}
