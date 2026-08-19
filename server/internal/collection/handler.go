package collection

import (
	"encoding/json"
	"mime/multipart"
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

func (h *Handler) GetUserCollections(w http.ResponseWriter, r *http.Request) {
	currentUser := middleware.GetUser(r)

	collections, err := h.service.GetUserCollections(currentUser.UserID)
	if err != nil {
		http.Error(w, "failed to get collections", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(collections)
}

func (h *Handler) CreateUserCollections(w http.ResponseWriter, r *http.Request) {
	currentUser := middleware.GetUser(r)
	r.ParseMultipartForm(5 << 20)

	name := r.FormValue("name")
	if name == "" {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}

	var file multipart.File
	var fileHeader *multipart.FileHeader
	var err error

	file, fileHeader, err = r.FormFile("cover_photo")
	if err != nil && err != http.ErrMissingFile {
		http.Error(w, "invalid file", http.StatusBadRequest)
		return
	}
	if file != nil {
		defer file.Close()
	}

	id, err := h.service.CreateCollection(currentUser.UserID, name, file, fileHeader)
	if err != nil {
		http.Error(w, "failed to create collection", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"message":       "collection created",
		"collection_id": id,
	})
}
