package handler

import (
	"backend/internal/service"
	"encoding/json"
	"errors"
	"net/http"
)

// Handler for retrieving HTTP request with code and a test cases array
// Calls service and returns the response.

type RunRequest struct {
	Code string `json:"code"`
}

type RunResponse struct {
	Stdout string `json:"stdout"` 
	Stderr string `json:"stderr"` 
	ExitCode int  `json:"exitCode"` 
	TimedOut bool `json:"timedOut"` 
}

type Handler struct {
	// buffered channel used as a counter. Each running job holds one slot.
	// chan is Go's built in pipe for passing values between goroutines.
	// struct is empty as we do not use this pipe to send data, but as a counter.
	svc *service.ExecutionService
	slots chan struct{}
}

// Constructor, make a buffered channel with a max value of items it can hold.
// Returns a pointer to the handler. All requests share same handler and same channel.
func NewHandler(svc *service.ExecutionService, maxConcurrent int) (*Handler, error) {
	if maxConcurrent > 5 {
		return nil, errors.New("You cannot have more than 5 concurrent requests at once.")
	}
	return &Handler{svc: svc, slots: make(chan struct{}, maxConcurrent)}, nil
}

// function signature says you can only call Run on a Handler ()
func (h *Handler) Run(w http.ResponseWriter, r *http.Request) {
	// Read JSON body
	r.Body = http.MaxBytesReader(w, r.Body, 100<<10)
	var req RunRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
}
