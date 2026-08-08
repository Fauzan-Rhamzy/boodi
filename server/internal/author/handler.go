package author

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	log.Println(">>> HANDLER GET BY ID DIPANGGIL <<<")
	w.Header().Set("Content-Type", "application/json")

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Parameter 'id' wajib diisi"})
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Format 'id' harus berupa angka"})
		return
	}

	author, err := h.service.GetByID(id)
	if err != nil {
		// Jika errornya memang karena ID tidak ada di DB
		if err.Error() == "author dengan ID tersebut tidak ditemukan di DB" {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		// Jika errornya karena masalah Query / DB Connection (Internal Server Error)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error_db": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(author)
}

// func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
// 	books, err := h.service.GetAll()
// 	if err != nil {
// 		response.Error(w, http.StatusInternalServerError, err.Error())
// 		return
// 	}
// 	response.JSON(w, http.StatusOK, books)
// }
