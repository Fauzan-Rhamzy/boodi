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

func (s *Service) GetFavouriteBooks(userID int) ([]FavouriteBook, error) {
	return s.repo.GetFavourite(userID)
}

func (s *Service) GetLibrary(
	userID int,
	collectionID int,
) (*LibraryResponse, error) {
	return s.repo.GetLibrary(userID, collectionID)
}
