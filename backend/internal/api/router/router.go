package router

import (
	"backend/internal/api/handler"
	"net/http"
)

// Sets up HTTP routes (look into chi, gin)
// Points routes to handlers

func Router(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /execute", h.Run)
	return mux
}