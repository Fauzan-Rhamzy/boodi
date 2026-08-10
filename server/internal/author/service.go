package author

import (
	"errors"
	"log"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetByID(id int) (*Author, error) {
	author, err := s.repo.FindByID(id)
	if err != nil {
		log.Println("ERROR ASLI:", err)
		return nil, errors.New("Author not found")
	}
	return author, nil
}
