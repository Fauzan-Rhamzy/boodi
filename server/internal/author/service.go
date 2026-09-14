package author

import "errors"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll() ([]Author, error) {
	return s.repo.FindAll()
}

func (s *Service) Create(req CreateAuthorRequest) (int, error) {
	if req.Name == "" {
		return 0, errors.New("author name is required")
	}
	return s.repo.Create(req)
}

func (s *Service) GetAuthorByID(id int) (*Author, error) {
	return s.repo.FindByID(id)
}
