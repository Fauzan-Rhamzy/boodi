package collection

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

func (s *Service) AddToFavourite(userID int, bookID int) error {
	return s.repo.AddToFavourite(userID, bookID)
}

func (s *Service) DeleteFromFavourite(userID int, bookID int) error {
	return s.repo.DeleteFromFavourite(userID, bookID)
}

func (s *Service) IsBookFavourited(UserID int, bookID int) (bool, error) {
	return s.repo.IsBookFavourited(UserID, bookID)
}
