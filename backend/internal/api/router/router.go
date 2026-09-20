package router

import (
	"backend/internal/api/handler"
	"net/http"
)

// Sets up HTTP routes (look into chi, gin)
// Points routes to handlers

func Router(svc *service.ExecutionService) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /execute", handler.Run(svc))
}