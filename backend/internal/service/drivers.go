package service

import "fmt"

// Builds a small python script that imports a function by name from a file
// (code.py that we generate with the user code), reads stdin (test case input),
// decodes it as real python data and invokes the function using
// those arguments.
func pythonDriver(functionName string) string {
	return fmt.Sprintf(`
	import json, sys
	from code import %s
	
	args = json.loads(sys.stdin.read())
	result = %s(*args)
	print(json.dump(result))
	`, functionName, functionName)
}