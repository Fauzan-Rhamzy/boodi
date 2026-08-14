package auth

import (
	"encoding/json"
	"net/http"
	"os"
	"server/internal/shared/middleware"
	"strconv"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "request is not valid", http.StatusBadRequest)
		return
	}

	if err := h.service.Register(req); err != nil {
		if err.Error() == "email already registered" {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "register success",
	})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "request is not valid", http.StatusBadRequest)
		return
	}

	token, err := h.service.Login(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	https := os.Getenv("HTTP_SECURE")
	secure, err := strconv.ParseBool(https)
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   60 * 60 * 24,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "login success",
	})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	https := os.Getenv("HTTP_SECURE")
	secure, _ := strconv.ParseBool(https)
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   -1,
	})
}

func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)
	firstName, err := h.service.GetFirstName(user.UserID)
	if err != nil {
		http.Error(w, "failed to get user", http.StatusInternalServerError)
		return
	}

	profilePicture, err := h.service.GetProfilePicture(user.UserID)
	if profilePicture == "" {
		profilePicture = "profile/dummy.png"
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"user_id":         user.UserID,
		"first_name":      firstName,
		"role":            user.Role,
		"profile_picture": profilePicture,
	})
}
