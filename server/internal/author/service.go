package author

import (
	"database/sql"
	"errors"
	"log"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// func (s *Service) GetAll() ([]Author, error) {
// 	return s.repo.FindAll()
// }

func (s *Service) GetByID(id int) (*Author, error) {
	author, err := s.repo.FindByID(id)
	if err != nil {
		// Log error spesifik ke terminal
		log.Println("❌ DATABASE ERROR saat FindByID:", err)

		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("author dengan ID tersebut tidak ditemukan di DB")
		}
		return nil, err
	}
	return author, nil
}
