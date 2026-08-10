package middleware

import "net/http"

func RequireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		user := GetUser(req)

		if user.Role != "admin" {
			http.Error(w, "akses ditolak", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, req)
	})
}
