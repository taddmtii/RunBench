package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

type TestCaseResult struct {
	Index    int    `json:"index"`
	Passed   bool   `json:"passed"`
	Input    string `json:"input"`
	Expected string `json:"expected"`
	Actual   string `json:"actual"`
	Stderr   string `json:"stderr"`
	TimedOut bool   `json:"timedOut"`
}

type TestCase struct {
	Input          json.RawMessage `json:"input"`
	ExpectedOutput string          `json:"expectedOutput"`
}

type RunResult struct {
	Stdout   string
	Stderr   string
	ExitCode int
	TimedOut bool
}

type SubmitResult struct {
	Stdout          string       `json:"stdout"`
	Stderr          string       `json:"stderr"`
	ExitCode        int          `json:"exitCode"`
	TimedOut        bool         `json:"timedOut"`
	TotalCount      int          `json:"totalCount"`
	PassedCount     int          `json:"passedCount"`
	Results 		[]TestCaseResult `json:"results"`
}

var fileExtensions = map[string]string{
	"python":     ".py",
	"typescript": ".ts",
	"javascript": ".js",
	"csharp":     ".cs",
	"cpp":        ".cpp",
}

// Exists jsut so we can put methods on it like RunPython
type ExecutionService struct{}

// Constructor, just returns a pointer to a new service.
func NewExecutionService() *ExecutionService {
	return &ExecutionService{}
}

// Creates temp sandbox directory containing code file to run.
func (s *ExecutionService) CreateTempDirAndCodeFile(code string, langauge string) (string, string, error) {
	extension := fileExtensions[langauge]

	// Create new folder in the OS temp location. * is replaced by a random number.
	dir, err := os.MkdirTemp("", "sandbox-*")
	if err != nil {
		return "", "", err
	}

	// Container user is UID 1000, which is not permitted to view it.
	// Changes folders permissions so that everyone can read it
	err = os.Chmod(dir, 0o755)
	if err != nil {
		os.RemoveAll(dir)
		return "", "", err
	}

	// Creates code file inside temp folder we created
	// with updated permissions. 0o644 means everyone can ready the file.
	// Only we can write to it.
	err = os.WriteFile(filepath.Join(dir, "code"+extension), []byte(code), 0o644)
	if err != nil {
		os.RemoveAll(dir)
		return "", "", err
	}

	return dir, extension, nil
}

// Used by Submit to add onto CreateTempDirAndCodeFile. We want to additioanlly write the code
// AND the driver file so that we can invoke the function serveral times with different inputs (args)
func (s *ExecutionService) CreateTempDirAndDriver(code string, functionName string, language string) (string, string, error) {
	dir, extension, err := s.CreateTempDirAndCodeFile(code, language)
	if err != nil {
		return "", "", err
	}

	// Creates driver file with the code that we defined in pythonDriver since we are actually 
	// running test cases when we submit.
	err = os.WriteFile(filepath.Join(dir, "driver.py"), []byte(pythonDriver(functionName)), 0o644);
	if err != nil {
		os.RemoveAll(dir)
		return "", "", err
	}

	return dir, extension, nil
}

// Prepares files and directory, and then calls runContainer with the code.
func (s *ExecutionService) Run(code string, language string) (RunResult, error) {
	dir, extension, err := s.CreateTempDirAndCodeFile(code, language)
	if err != nil {
		return RunResult{}, err
	}

	// Schedule deletion of temp directory once we exit this function.
	defer os.RemoveAll(dir)

	var image string
	var command string
	// Run separate containers depending on what language it is.
	switch language {
	case "python":
		image, command = "python-sandbox", "python"
	case "typescript":
		image, command = "typescript-sandbox", "tsx"
	case "javascript":
		image, command = "javascript-sandbox", "node"
	case "cpp":
		image, command = "cpp-sandbox", "run-cpp"
	case "csharp":
		image, command = "csharp-sandbox", "run-csharp"
	}
	return s.RunContainer(dir, image, command, extension, "code"+extension ,"")
}

func (s *ExecutionService) Submit(code string, language string, functionName string, testCases []TestCase) (SubmitResult, error) {
	dir, extension, err := s.CreateTempDirAndDriver(code, functionName, language)
	if err != nil {
		return SubmitResult{}, err
	}

	// Schedule deletion of temp directory once we exit this function.
	defer os.RemoveAll(dir)

	var image string
	var command string
	// Run separate containers depending on what language it is.
	switch language {
	case "python":
		image, command = "python-sandbox", "python"
	case "typescript":
		image, command = "typescript-sandbox", "tsx"
	case "javascript":
		image, command = "javascript-sandbox", "node"
	case "cpp":
		image, command = "cpp-sandbox", "run-cpp"
	case "csharp":
		image, command = "csharp-sandbox", "run-csharp"
	}
	runResult, err := s.RunContainer(dir, image, command, extension, "code"+extension, "")
	if err != nil {
		return SubmitResult{
			Stdout:   runResult.Stdout,
			Stderr:   runResult.Stderr,
			ExitCode: runResult.ExitCode,
			TimedOut: runResult.TimedOut,
		}, err
	}
	// Initial run is successful, run each test case
	if runResult.ExitCode == 0 {
		results, err := s.RunTestCases(dir, image, command, extension, testCases)
		if err != nil {
			return SubmitResult{}, err
		}
		passedCount := 0
		for _, r := range results {
			if r.Passed {
				passedCount++
			}
		}
		return SubmitResult{
			Stdout:      runResult.Stdout,
			Stderr:      runResult.Stderr,
			ExitCode:    runResult.ExitCode,
			TimedOut:    runResult.TimedOut,
			TotalCount:  len(testCases),
			PassedCount: passedCount,
			Results:     results,
		}, nil
	}
	return SubmitResult{
		Stdout:   runResult.Stdout,
		Stderr:   runResult.Stderr,
		ExitCode: runResult.ExitCode,
		TimedOut: runResult.TimedOut,
	}, nil
}

func (s *ExecutionService) RunTestCases(dir string, image string, command string, extension string, testCases []TestCase) ([]TestCaseResult, error) {

	// One slot per test case. Every goroutine writes only to outcomes[i]
	// Ensures thread safety.
	results := make([]TestCaseResult, len(testCases))

	// Waits for all goroutines to finish before reading results
	var wg sync.WaitGroup
	const maxConcurrent = 5
	semaphore := make(chan struct{}, maxConcurrent)

	for i, tc := range testCases {
		// Tell WaitGroup there is one more thing to wait for.
		wg.Add(1)
		// Take a slot and block here once maxConcurrent (5) are running
		semaphore <- struct{}{}

		go func(i int, tc TestCase) {
			// Covers early returns as well, whenever we exit the function we are done with that routine.
			defer wg.Done()
			// Release the slot when this routine ends
			defer func() { <- semaphore}()

			res, err := s.RunContainer(dir, image, command, extension, "driver.py", string(tc.Input))
			if err != nil {
				results[i] = TestCaseResult{Index: i, Passed: false, Input: string(tc.Input), Expected: tc.ExpectedOutput, Stderr: err.Error()}
				return
			}
			results[i] = TestCaseResult{
				Index:    i,
				Passed:   !res.TimedOut && res.ExitCode == 0 && normalize(res.Stdout) == normalize(tc.ExpectedOutput),
				Input:    string(tc.Input),
				Expected: tc.ExpectedOutput,
				Actual:   res.Stdout,
				Stderr:   res.Stderr,
				TimedOut: res.TimedOut,
			}
		}(i, tc)
	}

	// Block until every goroutine has called Done()
	wg.Wait()

	return results, nil
}

// Used to build the args depending on the language chosen. Takes the image string and extension for code file
// targetFile is the file inside /code that should actually be executed. code.py during a normal run, and driver.py on test cases.
func (s *ExecutionService) BuildDockerRunArgs(dir string, image string, command string, extension string, targetFile string) ([]string, string) {
	// build docker run command with isolation flags
	name := "exec-" + uuid.NewString()
	args := []string{
		"run",
		"--rm",         // delete the container when it exits
		"-i",           // keep stdin open so test input reaches the program.
		"--name", name, // we can kill it by name if need be
		"--tmpfs", "/tmp:rw,noexec,nosuid,size=64m",
		"--network", "none", // no network access
		"--memory", "256m", // memory cap
		"--memory-swap", "256m",
		"--cpus", "0.5", // CPU cap
		"--pids-limit", "64", // stops fork (process) bombs
		"--read-only",       // read-only container filesystem
		"--cap-drop", "ALL", // drop all Linux capabilities.
		"--security-opt", "no-new-privileges",
		"--user", "1000:1000", // matches the UID set in docker container.
		"-v", dir + ":/code:ro", // mount temp dir, read-only
	}
	// Conditional flags before image and command for running file.
	if extension == ".cpp" || extension == ".cs" {
		// CPP + CS dockerfile has a special temp filesystem called work that
		// allows exec, since thats where the compiled binary must run.
		args = append(args, "--tmpfs", "/work:rw,exec,nosuid,size=64m")
	}
	args = append(args, image, command, "/code/" + targetFile)
	return args, name
}

// Runs a container against a directory containing the file with code.
func (s *ExecutionService) RunContainer(dir string, image string, command string, extension string, targetFile string, input string) (RunResult, error) {
	args, name := s.BuildDockerRunArgs(dir, image, command, extension, targetFile)

	// build timeout context ("timer object"). Cancels itself
	// after 10 seconds (intended for duration of run command). Resources are rerelesaed if command finishes early.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
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

	// Read test cases input to stdin if we are running them.
	if input != "" {
		cmd.Stdin = bytes.NewReader([]byte(input))
	}

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

	return RunResult{
		Stdout:   stdout.String(),
		Stderr:   stderr.String(),
		ExitCode: exitCode,
		TimedOut: timedOut,
	}, nil
}

func normalize(s string) (string) {
	return strings.TrimSpace(strings.ReplaceAll(s, "\r\n", "\n"))
}