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
