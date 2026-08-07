package auth

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
}

type Token struct {
	UserID int    `json:"user_id"`
	Role   string `json:"role"`
}

type User struct {
	ID       int
	Email    string
	Password string
	Role     string
}
