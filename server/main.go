package main

import (
	"fmt"
	"log"
	"net/http"

	// import controllers
	"server/controllers"
)

func main() {
	// route / and function from controllers
	http.HandleFunc("/", controllers.Hello)

	// port
	port := ":8080"
	fmt.Printf("Starting server at port %s\n", port)

	// run server and listen for errors
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
