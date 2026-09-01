package review

import (
	"encoding/json"
	"net/http"
	"server/internal/shared/middleware"
	"server/internal/shared/response"
	"strconv"
	"strings"

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

type CreateReviewRequet struct {
    BookID  int    `json:"book_id"`
    Rating  int    `json:"rating"`
    Comment string `json:"comment"`
}

func (h *Handler) CreateReview(w http.ResponseWriter, r *http.Request) {
    var req CreateReviewRequest

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    if req.Rating < 1 || req.Rating > 5 {
        http.Error(w, "Rating must be between 1 and 5", http.StatusBadRequest)
        return
    }

    if strings.TrimSpace(req.Comment) == "" {
        http.Error(w, "Comment is required", http.StatusBadRequest)
        return
    }

	user := middleware.GetUser(r)
    

    review, err := h.service.CreateReview(
        user.UserID,
        req.BookID,
        req.Rating,
        strings.TrimSpace(req.Comment),
    )

    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(review)
}