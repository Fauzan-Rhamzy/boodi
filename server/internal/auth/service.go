package auth

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Register(req RegisterRequest) error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = s.repo.Create(req, string(hashed))
	return err
}

func (s *Service) Login(req LoginRequest) (string, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return "", errors.New("Email not found")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		log.Printf("FindByEmail error: %v | email: %s", err, req.Email)
		return "", errors.New("Wrong password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(), // expired 24 H
	})

	tokenString, err := token.SignedString([]byte(os.Getenv(("JWT_SECRET"))))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *Service) Logout(req LoginRequest) {
	return
}
