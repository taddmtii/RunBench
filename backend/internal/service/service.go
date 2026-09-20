package service

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type Result struct {
	Stdout   string
	Stderr   string
	ExitCode int
	TimedOut bool
}

type FileExtensions struct

// Exists jsut so we can put methods on it like RunPython
type ExecutionService struct{}

// Constructor, just returns a pointer to a new service.
func NewExecutionService() *ExecutionService {
	return &ExecutionService{}
}

// Prepares files and directory, and then calls runContainer with the code.
func (s *ExecutionService) Run(code string, language string) (Result, error) {
	fileExtensions := map[string]string {
		"python" : ".py",
		"typescript": ".ts",
		"javascript": ".js",
		"csharp": ".cs"
		"cpp": ".cpp"
	}

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

	// Creates code file inside temp folder we created
	// with updated permissions. 0o644 means everyone can ready the file.
	// Only we can write to it.
	extension := fileExtensions[language]
	err = os.WriteFile(filepath.Join(dir, "code" + extension), []byte(code), 0o644)
	if err != nil {
		return Result{}, err
	}
	// Run separate containers depending on what language it is.
	switch language {
	case "python":
		return s.RunContainer(dir, "python-sandbox", language, extension)
	case "typescript":
		return s.RunContainer(dir, "typescript-sandbox", language, extension)
	case "javascript":
		return s.RunContainer(dir, "javascript-sandbox", language, extension)
	}
	// return s.RunContainer(dir)
}

// Used to build the args depending on the language chosen. Takes the image string and extension for code file
func (s *ExecutionService) BuildDockerRunArgs(image string, language string, extension string) ([]string, error) {
	// build docker run command with isolation flags
	name := "exec-" + uuid.NewString()
	args := []string {
		"run",
		"--rm",         // delete the container when it exits
		"--name", name, // we can kill it by name if need be
		"--network", "none", // no network access
		"--memory", "128m", // memory cap
		"--memory-swap", "128m",
		"--cpus", "0.5", // CPU cap
		"--pids-limit", "64", // stops fork (process) bombs
		"--read-only",       // read-only container filesystem
		"--cap-drop", "ALL", // drop all Linux capabilities.
		"--security-opt", "no-new-privileges",
		"--user", "1000:1000", // matches the UID set in docker container.
		"-v", dir + ":/code:ro", // mount temp dir, read-only
		image,          // the image
		language, "/code/code" + extension, // the command to run inside it
	}
}

// Runs a container against a directory containing the file with code.
func (s *ExecutionService) RunContainer(dir string, image string, langauge string, extension string) (Result, error) {
	args := BuildDockerRunArgs(image, language, extension)

	// build timeout context ("timer object"). Cancels itself
	// after 5 seconds (intended for duration of run command). Resources are rerelesaed if command finishes early.
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// exec.Command itself creates a Cmd struct that represents an entire external process.
	// this executes the command with a context. When context expires, Go kills this process automatically.
	// super convenient
	cmd := exec.CommandContext(ctx, "docker", args...)


	// bytes.Buffer implements io.Writer, whcih cmd.stdout and cmd.stderr expect.
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	// zero value in go for int is 0 automatically, so assumed success if we do not hit an error.
	var exitCode int
	var timedOut bool

	// Run the command.
	err := cmd.Run()
	if err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			timedOut = true
			// Forced timeout of 3 seconds for entire container.
			containerCtx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
			cmd := exec.CommandContext(containerCtx, "docker", "kill", name)
			cmd.Run()
			cancel()
		}
		fmt.Println("error while running docker run command: ", err)
		exitCode = 1
	}

	return Result{
		Stdout: stdout.String(),
		Stderr: stderr.String(),
		ExitCode: exitCode,
		TimedOut: timedOut,
	}, nil
}

// func (s* ExecutionService) RunTypescriptContainer(dir string) (Result, error) {
// 	return Result{}, nil
// }

// func (s* ExecutionService) RunJavascriptContainer(dir string) (Result, error) {
// 	return Result{}, nil
// }

