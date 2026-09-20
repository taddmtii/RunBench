package service

// Contains main logic for ...
// Initializing Docker clinet
// For each test case spin up container, execute code and caputre any output or errors.
// Aggregate results and return

type Result struct {
	Stdout string
	Stderr string
	ExitCode int
	TimedOut bool
}

type ExecutionService struct{}

func NewExecutionService() *ExecutionService {
	return &ExecutionService{}
}

func (s *ExecutionService) RunPython(code string) (Result, error) {
	// make temp dir
	// write script.py
	// run docker with isolation flags
	// return the Result
}