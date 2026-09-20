package router

import (
	"backend/internal/api/handler"
	"net/http"
)

// Sets up HTTP routes, and points them to reference to handler function

func Router(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /run", h.Run)
	mux.HandleFunc("POST /submit", h.Submit)
	return mux
}
