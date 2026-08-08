package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	// import controllers
	//"server/controllers"

	"server/internal/auth"
	"server/internal/author"
	"server/internal/book"
	"server/internal/shared/db"
)

type RequestData struct {
	Username string `json:"username"`
}

type ResponseData struct {
	Message string `json:"message"`
}

func corsMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		}

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		h.ServeHTTP(w, r)
	})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	var requestData RequestData
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid Body", http.StatusBadRequest)
		return
	}

	username := requestData.Username
	response := ResponseData{Message: "Hello " + username + "! From Backend."}

	json.NewEncoder(w).Encode(response)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	port := os.Getenv("SERVER_PORT")

	dbCon := db.NewDB()
	defer dbCon.Close()

	authRepo := auth.NewRepository(dbCon)
	authService := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authService)

	bookRepo := book.NewRepository(dbCon)
	bookService := book.NewService(bookRepo)
	bookHandler := book.NewHandler(bookService)

	authorRepo := author.NewRepository(dbCon)
	authorService := author.NewService(authorRepo)
	authorHandler := author.NewHandler(authorService)

	// reviewRepo    := review.NewRepository(db)
	// reviewService := review.NewService(reviewRepo)
	// reviewHandler := review.NewHandler(reviewService)

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	// router.Use(middleware.CORS)
	router.Use(cors.Handler(cors.Options{
		// 1. Mengizinkan localhost dengan port berapa pun
		AllowedOrigins: []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		// 2. Mengizinkan SEMUA headers (menghindari error missing header)
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	router.Post("/api/auth/login", authHandler.Login)
	router.Post("/api/auth/register", authHandler.Register)

	router.Get("/api/book", bookHandler.GetAll)
	router.Get("/api/author", authorHandler.GetByID)

	// http.Handle("/api/hello", corsMiddleware(http.HandlerFunc(helloHandler)))

	fmt.Println("Server is running on http://localhost:" + port)
	// http.ListenAndServe(":"+port, nil)
	fmt.Println("Server running on port :" + port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

// func main() {
// 	// route / and function from controllers
// 	http.HandleFunc("/", controllers.Hello)

// 	// port
// 	port := ":8080"
// 	fmt.Printf("Starting server at port %s\n", port)

// 	// run server and listen for errors
// 	if err := http.ListenAndServe(port, nil); err != nil {
// 		log.Fatal(err)
// 	}
// }
