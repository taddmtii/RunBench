package handler

import "net/http"

// Handler for retrieving HTTP request with code and a test cases array
// Calls service and returns the response.
func ExecuteCode(svc *service.ExecutionService) http.HandlerFunc {}