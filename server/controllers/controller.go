package controllers

import (
	"fmt"
	"net/http"
)

// started with a capital so it can be exported to other files
func Hello(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, "Hello! Your Go server is successfully running.")
}
