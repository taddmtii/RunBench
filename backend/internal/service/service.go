package service

import (
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

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
	// with updated permissions. 0o644 means everyone can ready the file.
	// Only we can write to it.
	err = os.WriteFile(filepath.Join(dir, "script.py"), []byte(code), 0o644)
	if err != nil {
		return Result{}, err
	}
	return s.runContainer(dir)
}

// Runs a container against a directory containing the file with code.
func (s *ExecutionService) runContainer(dir string) (Result, error) {
	// build docker run command with isolation flags
	name := "exec-" + uuid.NewString()
	args := []string{
		"run",
		"--rm",         // delete the container when it exits
		"--name", name, // we can kill it by name if need be
		"--network", "none", // no network access
		"--memory", "128m", // memory cap
		"--cpus", "0.5", // CPU cap
		"--pids-limit", "64", // stops fork (process) bombs
		"--read-only",       // read-only container filesystem
		"--cap-drop", "ALL", // drop all Linux capabilities
		"--security-opt", "no-new-privileges",
		"--user", "1000:1000", // matches the UID in your RunPython comment
		"-v", dir + ":/code:ro", // mount your temp dir, read-only
		"python:3.12-slim",          // the image
		"python", "/code/script.py", // the command to run inside it
	}

	// run it wiht a timeout
	// capture stdout and stderr
	// handle timeout, non-zero exit, and real errors
	return Result{}, nil
}
