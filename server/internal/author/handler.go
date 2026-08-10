package author

import (
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

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "id not valid")
		return
	}

	author, err := h.service.GetByID(id)
	if err != nil {
		response.Error(w, http.StatusNotFound, err.Error())
		return
	}
	response.JSON(w, http.StatusOK, author)
}

// func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
// 	books, err := h.service.GetAll()
// 	if err != nil {
// 		response.Error(w, http.StatusInternalServerError, err.Error())
// 		return
// 	}
// 	response.JSON(w, http.StatusOK, books)
// }
