package book

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"server/internal/shared/response"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	books, err := h.service.GetAll()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSON(w, http.StatusOK, books)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "id not valid")
		return
	}

	book, err := h.service.GetByID(id)
	if err != nil {
		response.Error(w, http.StatusNotFound, err.Error())
		return
	}
	response.JSON(w, http.StatusOK, book)
}
func (h *Handler) SearchBooks(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")

	books, err := h.service.SearchBooks(query)

	if err != nil {
		log.Printf("SearchBooks error: %v", err)
		http.Error(w, "Failed to search books", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(books)
}
func (h *Handler) GetTrendingBooks(w http.ResponseWriter, r *http.Request) {
	books, err := h.service.GetTrendingBooks()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, books)
}

// POST /api/books
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	// parse multipart untuk cover image
	r.ParseMultipartForm(5 << 20)

	// parse JSON fields dari form
	var req CreateBookRequest
	req.Title = r.FormValue("title")
	req.Language = r.FormValue("language")
	req.Description = r.FormValue("desc")

	price, _ := strconv.ParseFloat(r.FormValue("price"), 64)
	req.Price = price

	year, _ := strconv.Atoi(r.FormValue("year"))
	req.Year = year

	page, _ := strconv.Atoi(r.FormValue("page"))
	req.Page = page

	// parse author_ids dan genre_ids dari JSON string
	json.Unmarshal([]byte(r.FormValue("author_ids")), &req.AuthorIDs)
	json.Unmarshal([]byte(r.FormValue("genre_ids")), &req.GenreIDs)
	fmt.Println(req)

	if req.Title == "" || len(req.AuthorIDs) == 0 || len(req.GenreIDs) == 0 {
		http.Error(w, "title, author, and genre are required", http.StatusBadRequest)
		return
	}

	// handle cover image
	cover := ""
	file, fileHeader, err := r.FormFile("cover")
	if err == nil {
		defer file.Close()
		os.MkdirAll("images/books", os.ModePerm)
		ext := filepath.Ext(fileHeader.Filename)
		filename := fmt.Sprintf("book_%d%s", time.Now().Unix(), ext)
		savePath := filepath.Join("images/books", filename)
		dst, err := os.Create(savePath)
		if err == nil {
			io.Copy(dst, file)
			dst.Close()
			cover = "books/" + filename
		}
	}

	bookID, err := h.service.Create(req, cover)
	if err != nil {
		http.Error(w, "failed to create book", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"book_id": bookID,
		"message": "book created",
	})
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "id not valid")
		return
	}

	deletedId, err := h.service.Delete(id)

	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, deletedId)
}

// POST /api/books
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)

	// parse multipart untuk cover image
	r.ParseMultipartForm(5 << 20)

	// parse JSON fields dari form
	var req CreateBookRequest
	req.Title = r.FormValue("title")
	req.Language = r.FormValue("language")
	req.Description = r.FormValue("desc")

	price, _ := strconv.ParseFloat(r.FormValue("price"), 64)
	req.Price = price

	year, _ := strconv.Atoi(r.FormValue("year"))
	req.Year = year

	page, _ := strconv.Atoi(r.FormValue("page"))
	req.Page = page

	// parse author_ids dan genre_ids dari JSON string
	json.Unmarshal([]byte(r.FormValue("author_ids")), &req.AuthorIDs)
	json.Unmarshal([]byte(r.FormValue("genre_ids")), &req.GenreIDs)
	fmt.Println(req)

	if req.Title == "" || len(req.AuthorIDs) == 0 || len(req.GenreIDs) == 0 {
		http.Error(w, "title, author, and genre are required", http.StatusBadRequest)
		return
	}

	// handle cover image
	cover := ""
	file, fileHeader, err := r.FormFile("cover")
	if err == nil {
		defer file.Close()
		os.MkdirAll("images/books", os.ModePerm)
		ext := filepath.Ext(fileHeader.Filename)
		filename := fmt.Sprintf("book_%d%s", time.Now().Unix(), ext)
		savePath := filepath.Join("images/books", filename)
		dst, err := os.Create(savePath)
		if err == nil {
			io.Copy(dst, file)
			dst.Close()
			cover = "books/" + filename
		}
	}

	bookID, err := h.service.Update(id, req, cover)
	if err != nil {
		http.Error(w, "failed to update book", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"book_id": bookID,
		"message": "book created",
	})
}
