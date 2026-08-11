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
func (s *Service) SearchBooks(query string) ([]Book, error) {
	return s.repo.SearchBooks(query)
}
func (s *Service) GetTrendingBooks() ([]Book, error) {
    return s.repo.GetTrendingBooks()
}

func (s *Service) GetCurrentlyReading(userID int) ([]Book, error) {
	return s.repo.GetCurrentlyReading(userID)
}