package middleware

import (
	"context"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserKey contextKey = "user"

type AuthUser struct {
	UserID int
	Role   string
}

func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		cookie, err := req.Cookie("token")
		if err != nil {
			http.Error(w, "no token", http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(cookie.Value, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "token is not valid", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "token is not valid", http.StatusUnauthorized)
			return
		}

		user := AuthUser{
			UserID: int(claims["user_id"].(float64)),
			Role:   claims["role"].(string),
		}
		ctx := context.WithValue(req.Context(), UserKey, user)
		next.ServeHTTP(w, req.WithContext(ctx))
	})
}

func GetUser(r *http.Request) AuthUser {
	return r.Context().Value(UserKey).(AuthUser)
}
