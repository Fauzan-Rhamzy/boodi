package book

import "errors"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll() ([]Book, error) {
	return s.repo.FindAll()
}

func (s *Service) GetByID(id int) (*Book, error) {
	book, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("book not found")
	}
	return book, nil
}
