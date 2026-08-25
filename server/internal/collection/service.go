package collection

import (
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
func (s *Service) GetCurrentlyReading(userID int) ([]CurrentlyReadingBook, error) {
	return s.repo.GetCurrentlyReading(userID)
}

func (s *Service) GetFavouriteBooks(userID int) ([]FavouriteBooks, error) {
	return s.repo.GetFavourite(userID)
}

func (s *Service) GetLibrary(
	userID int,
	collectionID int,
) (*LibraryResponse, error) {
	return s.repo.GetLibrary(userID, collectionID)
}

func (s *Service) GetUserCollections(userID int) ([]Collection, error) {
	return s.repo.GetUserCollections(userID)

}

func (s *Service) CreateCollection(userID int, name string, file multipart.File, fileHeader *multipart.FileHeader) (int, error) {
	coverPhoto := ""
	if file != nil {

		ext := filepath.Ext(fileHeader.Filename)
		filename := fmt.Sprintf("%d_%d%s", userID, time.Now().Unix(), ext)
		savePath := filepath.Join("images/collections", filename)

		dst, err := os.Create(savePath)
		if err != nil {
			return 0, err
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			return 0, err
		}

		coverPhoto = "collections/" + filename
	}

	return s.repo.CreateUserCollections(userID, name, coverPhoto)
}

func (s *Service) AddToFavourite(userID int, bookID int) error {
	return s.repo.AddToFavourite(userID, bookID)
}

func (s *Service) DeleteFromFavourite(userID int, bookID int) error {
	return s.repo.DeleteFromFavourite(userID, bookID)
}

func (s *Service) IsBookFavourited(UserID int, bookID int) (bool, error) {
	return s.repo.IsBookFavourited(UserID, bookID)
}
