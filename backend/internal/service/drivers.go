package service

import "fmt"

var drivers = map[string]func(functionName string) string{
	"python":     pythonDriver,
	"javascript": javascriptDriver,
	"typescript": typescriptDriver,
}

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
const fs = require("fs");

const args = JSON.parse(fs.readFileSync(0, "utf8"));
const result = Array.isArray(args) ? %s(...args) : %s(...Object.values(args));
console.log(JSON.stringify(result));
`, functionName, functionName, functionName)
}

func typescriptDriver(functionName string) string {
	return fmt.Sprintf(`import { readFileSync } from "fs";
import { %s } from "./code";

const args = JSON.parse(readFileSync(0, "utf8"));
const result = Array.isArray(args) ? (%s as any)(...args) : (%s as any)(...Object.values(args));
console.log(JSON.stringify(result));
`, functionName, functionName, functionName)
}
