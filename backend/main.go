package main

import (
	"backend/internal/api/handler"
	"backend/internal/api/router"
	"backend/internal/service"
	"log"
	"net/http"
)

func main() {
	svc := service.NewExecutionService()
	h, err := handler.NewHandler(svc, 5)
	if err != nil {
		log.Fatal(err)
	}

	mux := router.Router(h)

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))

}
