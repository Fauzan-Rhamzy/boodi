package user

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetById(id int) (*User, error) {
	return s.repo.FindByID(id)
}

func (s *Service) UpdateProfile(id int, req UpdateProfileRequest, file multipart.File, fileHeader *multipart.FileHeader) error {
	if file != nil {

		ext := filepath.Ext(fileHeader.Filename)
		filename := fmt.Sprintf("%d_%d%s", id, time.Now().Unix(), ext)
		savePath := filepath.Join("images/profile", filename)

		dst, err := os.Create(savePath)
		if err != nil {
			return err
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			return err
		}

		req.PicPath = "profile/" + filename
	}

	return s.repo.Update(id, req)
}

func (s *Service) TrackBookProgress(userId int, bookId int, req TrackBookProgress) error {
	if req.PagesRead <= 0 {
		return errors.New("Pages must be bigger than zero")
	}

	if req.ReadDate == "" {
		return errors.New("Date cannot be empty")
	}

	return s.repo.TrackBookProgress(userId, bookId, req)
}

func (s *Service) GetUserBookProgress(userId int, bookId int) (int, error) {
	return s.repo.GetUserBookProgress(userId, bookId)
}
