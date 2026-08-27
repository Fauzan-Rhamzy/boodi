package review

import (
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