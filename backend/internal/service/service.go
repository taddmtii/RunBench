package service

import (
	"os"
	"path/filepath"
)

// Contains main logic for ...
// Initializing Docker clinet
// For each test case spin up container, execute code and caputre any output or errors.
// Aggregate results and return

type Result struct {
	Stdout   string
	Stderr   string
	ExitCode int
	TimedOut bool
}

// Exists jsut so we can put methods on it like RunPython
type ExecutionService struct{}

// Constructor, just returns a pointer to a new service.
func NewExecutionService() *ExecutionService {
	return &ExecutionService{}
}

// Prepares files and directory.
func (s *ExecutionService) RunPython(code string) (Result, error) {
	// Create new folder in the OS temp location. * is replaced by a random number.
	dir, err := os.MkdirTemp("", "sandbox-*")
	if err != nil {
		return Result{}, err
	}
	// Schedules deletion of folder when func returns
	defer os.RemoveAll(dir)

	// Container user is UID 1000, which is not permitted to view it.
	// Changes folders permissions so that everyone can read it
	err = os.Chmod(dir, 0o755)
	if err != nil {
		return Result{}, err
	}

	// Creates script.py inside temp folder we created
	// with updated permissions. so that only the contianer
	// can read the file.
	err = os.WriteFile(filepath.Join(dir, "script.py"), []byte(code), 0o644)
	if err != nil {
		return Result{}, err
	}

}
