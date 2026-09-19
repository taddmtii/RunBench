package handler

import (
	"backend/internal/service"
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
func NewHandler(maxConcurrent int) *Handler {
	return &Handler{slots: make(chan struct{}, maxConcurrent)}
}

func Run(svc *service.ExecutionService) http.HandlerFunc {}