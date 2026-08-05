package controllers

import (
	"fmt"
	"net/http"
)

// handler
func Hello(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, "Hello! Your Go server is successfully running.")
}
