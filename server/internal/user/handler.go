package user

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

func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "user_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "id not valid")
		return
	}

	user, err := h.service.GetById(id)
	if err != nil {
		response.Error(w, http.StatusNotFound, err.Error())
		return
	}
	response.JSON(w, http.StatusOK, user)
}

func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	currentUser := middleware.GetUser(r)

	id, err := strconv.Atoi(chi.URLParam(r, "user_id"))
	if err != nil || currentUser.UserID != id {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	r.ParseMultipartForm(5 << 20)

	req := UpdateProfileRequest{
		FirstName: r.FormValue("first_name"),
		LastName:  r.FormValue("last_name"),
		Phone:     r.FormValue("phone_number"),
	}

	var file multipart.File
	var fileHeader *multipart.FileHeader
	file, fileHeader, err = r.FormFile("pfp")
	if err != nil && err != http.ErrMissingFile {
		http.Error(w, "invalid file", http.StatusBadRequest)
		return
	}
	if file != nil {
		defer file.Close()
	}

	if err := h.service.UpdateProfile(id, req, file, fileHeader); err != nil {
		http.Error(w, "failed to update profile", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "profile updated",
	})
}
