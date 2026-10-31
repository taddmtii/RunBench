import { spawnSync } from "child_process";
import ts from "typescript";

const PY_CHECK = `
import ast, sys
try:
    ast.parse(sys.stdin.read())
except SyntaxError as e:
    print(f"{e.lineno}|{e.msg}")
    sys.exit(1)
`;

// Returns an error message if validation fails, otherwise null.
export function checkSyntax(code: string, language: string): string | null {
  if (language === "python") {
    // start a local python process and wait for it to finish.
    const py = spawnSync("python3", ["-c", PY_CHECK], {
      input: code,
      encoding: "utf8",
      timeout: 2000,
    });
    if (py.error || py.status === null)
      return "Python syntax check unavailable";
    if (py.status !== 0) {
      const [line, msg] = py.stdout.trim().split("|");
      return msg ? `line ${line}: ${msg}` : "Python syntax check failed";
    }

    // Also reject undefined Python names using ruff. Only undefined name rule (F821), read submitted code form stdin.
    const ruff = spawnSync(
      "ruff",
      [
        "check",
        "--select",
        "F821",
        "--output-format",
        "concise",
        "--stdin-filename",
        "input.py",
        "-",
      ],
      { input: code, encoding: "utf8", timeout: 2000 },
    );
    if (ruff.error || ruff.status === null || ruff.status > 1) {
      return "Python name check unavailable";
    }
    if (ruff.status === 0) return null;
    const match = ruff.stdout.match(/:(\d+):\d+: F821 (.*)/);
    return match ? `line ${match[1]}: ${match[2]}` : "Python name check failed";
  }

  if (language !== "javascript" && language !== "typescript") {
    return "Unsupported language";
  }

  // Processes code and reports diagnostics, returns first diagnostic if present.
  const { diagnostics } = ts.transpileModule(code, {
    reportDiagnostics: true,
    fileName: language === "typescript" ? "input.ts" : "input.js",
    compilerOptions: { target: ts.ScriptTarget.ES2020 },
  });
  const d = diagnostics?.[0];
  if (!d) return null;
  const line =
    d.file && d.start !== undefined
      ? d.file.getLineAndCharacterOfPosition(d.start).line + 1
      : "?";
  return `line ${line}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`;
}

export function parseErrorResponse(detail: string) {
  return {
    stdout: "",
    stderr: `There were parse errors. Please check your syntax.\n${detail}`,
    exitCode: 1,
    timedOut: false,
    totalCount: 0,
    passedCount: 0,
  };
}
