package author

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAuthorByID(id int) (*Author, error) {
	return s.repo.FindByID(id)
}
