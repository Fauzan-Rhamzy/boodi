package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"

	// import controllers
	//"server/controllers"

	"server/internal/auth"
	"server/internal/author"
	"server/internal/book"
	"server/internal/shared/db"
	"server/internal/shared/middleware"
)

// type RequestData struct {
// 	Username string `json:"username"`
// }

// type ResponseData struct {
// 	Message string `json:"message"`
// }

// func helloHandler(w http.ResponseWriter, r *http.Request) {
// 	var requestData RequestData
// 	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
// 		http.Error(w, "Invalid Body", http.StatusBadRequest)
// 		return
// 	}

// 	username := requestData.Username
// 	response := ResponseData{Message: "Hello " + username + "! From Backend."}

// 	json.NewEncoder(w).Encode(response)
// }

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load .env:", err)
	}

	port := os.Getenv("SERVER_PORT")

	dbCon := db.NewDB()
	defer dbCon.Close()

	// initialize features
	// auth
	authRepo := auth.NewRepository(dbCon)
	authService := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authService)

	// book
	bookRepo := book.NewRepository(dbCon)
	bookService := book.NewService(bookRepo)
	bookHandler := book.NewHandler(bookService)

	//author
	authorRepo := author.NewRepository(dbCon)
	authorService := author.NewService(authorRepo)
	authorHandler := author.NewHandler(authorService)

	// collection

	// review
	// reviewRepo    := review.NewRepository(db)
	// reviewService := review.NewService(reviewRepo)
	// reviewHandler := review.NewHandler(reviewService)

	router := chi.NewRouter()

	// middleware
	router.Use(middleware.CORS)
	// router.Use(chimiddleware.Log)
	// router.Use(chimiddleware.Recoverer)

	// public routes
	router.Post("/api/auth/login", authHandler.Login)
	router.Post("/api/auth/register", authHandler.Register)
	router.Get("/api/auth/logout", authHandler.Logout)
	// router.Get("/api/books", bookHandler.GetAll)
	router.Get("/api/books/trending", bookHandler.SearchBooks)

	router.Get("/api/books/{id}", bookHandler.GetByID)
	router.Get("/api/book/search", bookHandler.SearchBooks)
	router.Get("/api/author/{id}", authorHandler.GetByID)
	
	// protected routes for logged in users
	router.Group(func(r chi.Router) {
		r.Use(middleware.RequireAuth)
		r.Get("/api/auth/me", authHandler.Me)
		r.Get("/api/books", bookHandler.GetAll)
		r.Get("/api/bookDetail/{id}", bookHandler.GetByID)
		r.Get("/api/author/{id}", authorHandler.GetByID)
    r.Get("/api/book/search", bookHandler.SearchBooks)
	})

	// protected routes for admin
	router.Group(func(r chi.Router) {
		r.Use(middleware.RequireAuth)
		r.Use(middleware.RequireAdmin)
		//  r.Post("/api/books", bookHandler.Create)
		// r.Delete("/api/books/{id}", bookHandler.Delete)
	})
	router.Handle(
    "/images/*",
    http.StripPrefix(
        "/images/",
       http.FileServer(http.Dir("../images")),
    ),
)

	fmt.Println("Server is running on http://localhost:" + port)
	// http.ListenAndServe(":"+port, nil)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
