package genre

import (
	"encoding/json"
	"net/http"
	"server/internal/shared/response"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateGenreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	id, err := h.service.Create(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"genre_id": id,
		"message":  "genre created",
	})
}

func (h *Handler) FindAll(w http.ResponseWriter, r *http.Request) {
	genres, err := h.service.FindAll()
	if err != nil {
		http.Error(w, "failed to get genres", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(genres)
}

func (h *Handler) GetGenreBooks(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "genreID")
	genreID, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "genre id not valid")
		return
	}

	genreBooks, err := h.service.GetGenreBooks(genreID)

	if err != nil {
		http.Error(w, "invalid genre", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(genreBooks)
}

func (h *Handler) FindGenreByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "genreID")
	genreID, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "genre id not valid")
		return
	}

	genre, err := h.service.GetGenreByID(genreID)

	if err != nil {
		http.Error(w, "invalid genre", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(genre)

}
