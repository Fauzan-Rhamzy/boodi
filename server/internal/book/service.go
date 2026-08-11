package book

import "errors"

type Service struct {
	repo *BookRepository
}

func NewService(repo *BookRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll() ([]Book, error) {
	return s.repo.FindAll()
}

func (s *Service) GetByID(id int) (*Book, error) {
	book, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("buku tidak ditemukan")
	}
	return book, nil
}
func (s *Service) SearchBooks(query string) ([]Book, error) {
	return s.repo.SearchBooks(query)
}
