package review

import (
	"encoding/json"
	"net/http"
	"server/internal/shared/middleware"
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

func (h *Handler) GetTrendingReviews(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	reviews, err := h.service.GetTrendingReviews(user.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, reviews)
}

func (h *Handler) GetBookReviews(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)
	idStr := chi.URLParam(r, "book_id")
	idBook, err := strconv.Atoi(idStr)
	reviews, err := h.service.GetBookReviews(user.UserID, idBook)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, reviews)
}

func (h *Handler) GetBookRatings(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "book_id")
	idBook, err := strconv.Atoi(idStr)
	reviews, err := h.service.GetBookRating(idBook)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, reviews)
}

func (h *Handler) GetUserReviews(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	reviews, err := h.service.GetUserReviews(user.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, reviews)
}

func (h *Handler) ToggleLike(w http.ResponseWriter, r *http.Request) {
    reviewID, err := strconv.Atoi(chi.URLParam(r, "reviewID"))
    if err != nil {
        http.Error(w, "Invalid review ID", http.StatusBadRequest)
        return
    }

    user := middleware.GetUser(r)
	userID:=user.UserID

    liked, err := h.service.ToggleLike(userID, reviewID)
    if err != nil {
        http.Error(w, "Failed to toggle like", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]interface{}{
        "liked": liked,
    })
}
