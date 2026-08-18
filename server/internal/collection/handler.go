package collection

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
func (h *Handler) GetCurrentlyReading(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	books, err := h.service.GetCurrentlyReading(user.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, books)
}

func (h *Handler) GetFavouriteBooks(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	books, err := h.service.GetFavouriteBooks(user.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, books)
}

func (h *Handler) GetLibrary(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	collectionID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid library ID")
		return
	}

	library, err := h.service.GetLibrary(user.UserID, collectionID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, library)
}

func (h *Handler) AddToFavourite(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	bookID, err := strconv.Atoi(chi.URLParam(r, "bookId"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid book ID")
		return
	}

	if err := h.service.AddToFavourite(user.UserID, bookID); err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Added to favourite"})
}

func (h *Handler) DeleteFromFavourite(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	bookID, err := strconv.Atoi(chi.URLParam(r, "bookId"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid book ID")
		return
	}

	if err := h.service.DeleteFromFavourite(user.UserID, bookID); err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Deleted from favourite"})
}

func (h *Handler) IsBookFavourited(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUser(r)

	bookIDStr := chi.URLParam(r, "id")
	bookID, err := strconv.Atoi(bookIDStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid book ID")
		return
	}

	isFav, err := h.service.IsBookFavourited(user.UserID, bookID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to check favorite status")
		return
	}

	response.JSON(w, http.StatusOK, map[string]bool{"is_favourited": isFav})
}
