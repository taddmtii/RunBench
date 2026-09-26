package service

import "fmt"

// Builds a small python script that imports a function by name from a file
// (code.py that we generate with the user code), reads stdin (test case input),
// decodes it as real python data and invokes the function using
// those arguments.
func pythonDriver(functionName string) string {
	return fmt.Sprintf(`import json, sys
from code import %s

args = json.loads(sys.stdin.read())
if isinstance(args, dict):
	result = %s(**args)
else:
	result = %s(*args)
print(json.dumps(result))
`, functionName, functionName, functionName)
}


func javascriptDriver(functionName string) string {
	return fmt.Sprintf(`const { %s } = require("./code");

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const args = JSON.parse(data);
  const result = Array.isArray(args) ? %s(...args) : %s(...Object.values(args));
  console.log(JSON.stringify(result));
});
`, functionName, functionName, functionName)
}

func typescriptDriver(functionName string) string {
	return fmt.Sprintf(`import { %s } from "./code";

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const args = JSON.parse(data);
  const result = Array.isArray(args) ? (%s as any)(...args) : (%s as any)(...Object.values(args));
  console.log(JSON.stringify(result));
});
`, functionName, functionName, functionName)
}

