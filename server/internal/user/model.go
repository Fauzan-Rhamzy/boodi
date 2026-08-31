package user

type User struct {
	UserID     int    `json:"id"`
	Email      string `json:"email"`
	Phone      string `json:"phone"`
	Password   string `json:"password"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	ProfilePic string `json:"profile_pic"`
	Role       string `json:"role"`
	JoinedDate string `json:"joined_date"`
}

type UpdateProfileRequest struct {
	FirstName string
	LastName  string
	Phone     string
	PicPath   string
}

type TrackBookProgress struct {
	UserID    int    `json:"user_id"`
	BookID    int    `json:"book_id"`
	PagesRead int    `json:"pages_read"`
	ReadDate  string `json:"read_date"`
}

// type UserBook struct {
// 	UserBookID  int    `json:"user_book_id"`
// 	UserID      int    `json:"user_id"`
// 	BookID      int    `json:"book_id"`
// 	CurrentPage int    `json:"current_page"`
// 	LoggedAt    string `json:"logged_at"`
// }

// type ReadingHistory struct {
// 	ReadingHistoryID int    `json:"reading_log_id"`
// 	UserID           int    `json:"user_id"`
// 	BookID           int    `json:"book_id"`
// 	PagesRead        int    `json:"pages_read"`
// 	ReadDate         string `json:"read_date"`
// }
