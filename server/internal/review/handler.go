package review

import (
	"net/http"
	"server/internal/shared/middleware"
	"server/internal/shared/response"
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