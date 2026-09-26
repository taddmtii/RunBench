"use client"

import { useEffect, useState } from "react"
import { Editor } from "@monaco-editor/react"
import { ChevronDown, Play, Check, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Problem, TestCase } from "../../generated/prisma/client"
import CodeAnalysis from "./CodeAnalysis"

// Used for both run and submit. optional fields are populated by submit only.
interface RunResult {
    stdout: string
    stderr: string
    exitCode: number
    timedOut: boolean
    totalCount?: number
    passedCount?: number
    results?: {
        index: number
        passed: boolean
        input: string
        expected: string
        actual: string
        stderr: string
        timedOut: boolean
    }[]
}
interface CodeEditorProps {
    problem: Problem
}

const LANGUAGES = [
    { label: "Python", value: "python" },
    { label: "TypeScript", value: "typescript" },
    { label: "JavaScript", value: "javascript" },
    { label: "C++", value: "cpp" },
    { label: "C#", value: "csharp" },
]


export default function CodeEditor({ problem }: CodeEditorProps) {
    const [language, setLanguage] = useState("python")
    const [code, setCode] = useState( (problem?.functionStubs as Record<string, string>)?.["python"] ?? "")
    const [showPanel, setShowPanel] = useState(false)
    const [tab, setTab] = useState<"results" | "analysis">("results")
    const [result, setResult] = useState<RunResult>()
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
    const stub = (problem?.functionStubs as Record<string, string>)?.[language] ?? ""
    setCode(stub)
    }, [language, problem])

    const handleRunClick = async () => {
        try {
            setProcessing(true)
            const res = await fetch("/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code, language: language }),
            })
            if (!res.ok) {
                console.error("Something went wrong with Run.")
                return
            }
            const data = await res.json()
            setResult(data)
            setTab("results")
            setShowPanel(true)
        } catch (e) {
            console.error("Something went wrong with Run.")
            return
        } finally {
            setProcessing(false)
        }
        
    }

    const handleSubmitClick = async () => {
        const res = await fetch("/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code, language: language, functionName: problem.functionName, testCases: problem.testCases }),
        })
        if (!res.ok) {
            console.error("Something went wrong with Submit.")
            return
        }
        const data = await res.json()
        setResult(data)
        setTab("results")
        setShowPanel(true)
    }

    return (
        <div className="flex h-full min-h-[480px] flex-col gap-3 p-4">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e]">
                <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                                />
                            }
                        >
                            {LANGUAGES.find((l) => l.value === language)?.label}
                            <ChevronDown className="size-4 text-zinc-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuGroup>
                                {LANGUAGES.map((lang) => (
                                    <DropdownMenuItem key={lang.value} onClick={() => setLanguage(lang.value)}>
                                        {lang.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={processing}
                            onClick={handleRunClick}
                            className="cursor-pointer gap-2 border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
                        >
                            <Play className="size-3.5" />
                            {processing ? ("Running") : ("Run")}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSubmitClick}
                            disabled={processing}
                            className="cursor-pointer gap-2 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                        >
                            <Check className="size-3.5" />
                            Submit
                        </Button>
                    </div>
                </div>

                <div className="min-h-0 flex-1">
                    <Editor
                        height="100%"
                        value={code}
                        onChange={(value) => setCode(value ?? "")}
                        language={language}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            fontFamily: "'Fira Code', ui-monospace, monospace",
                            fontLigatures: true,
                            minimap: { enabled: false },
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: "on",
                            tabSize: 2,
                            cursorSmoothCaretAnimation: "on",
                            cursorBlinking: "smooth",
                            smoothScrolling: true,
                        }}
                    />
                </div>
            </div>

            {showPanel && (
                <div className="flex h-64 shrink-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e]">
                    <div className="flex items-center justify-between border-b border-zinc-800 px-2">
                        <div className="flex">
                            <button
                                onClick={() => setTab("results")}
                                className={`-mb-px cursor-pointer border-b-2 px-3 py-2 text-sm ${
                                    tab === "results"
                                        ? "border-emerald-500 text-white"
                                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Results
                            </button>
                            <button
                                onClick={() => setTab("analysis")}
                                className={`-mb-px cursor-pointer border-b-2 px-3 py-2 text-sm ${
                                    tab === "analysis"
                                        ? "border-emerald-500 text-white"
                                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                AI analysis
                            </button>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setShowPanel(false)}
                            className="cursor-pointer text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-3 text-sm text-zinc-200">
                        <div className={tab === "results" ? "" : "hidden"}>
                            {result?.results ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-zinc-200">
                                        {result.passedCount}/{result.totalCount} test cases passed
                                    </p>
                                    {result.results.map((r) => (
                                        <div
                                            key={r.index}
                                            className={`rounded border p-2 text-xs ${
                                                r.passed
                                                    ? "border-emerald-800 bg-emerald-950/30"
                                                    : "border-red-800 bg-red-950/30"
                                            }`}
                                        >
                                            <p className={`mb-1 font-medium ${r.passed ? "text-emerald-400" : "text-red-400"}`}>
                                                Test case {r.index + 1}: {r.passed ? "Passed" : "Failed"}
                                            </p>
                                            <p className="text-zinc-300">
                                                <span className="text-zinc-500">Input: </span>{r.input}
                                            </p>
                                            <p className="text-zinc-300">
                                                <span className="text-zinc-500">Expected: </span>{r.expected}
                                            </p>
                                            <p className="text-zinc-300">
                                                <span className="text-zinc-500">Actual: </span>{r.actual}
                                            </p>
                                            {r.timedOut && <p className="mt-1 text-yellow-400">Timed out</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : result ? (
                                <div className="space-y-2">
                                    <p className={`text-sm font-medium ${result.exitCode === 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {result.exitCode === 0 ? "Code ran successfully!" : "Code could not run."}
                                    </p>
                                    {result.stdout && (
                                        <div>
                                            <p className="mb-1 text-xs text-zinc-500">Stdout</p>
                                            <pre className="whitespace-pre-wrap rounded bg-black/30 p-2 font-mono text-xs text-zinc-200">
                                                {result.stdout}
                                            </pre>
                                        </div>
                                    )}
                                    {result.stderr && (
                                        <div>
                                            <p className="mb-1 text-xs text-zinc-500">Stderr</p>
                                            <pre className="whitespace-pre-wrap rounded bg-black/30 p-2 font-mono text-xs text-red-400">
                                                {result.stderr}
                                            </pre>
                                        </div>
                                    )}
                                    {result.timedOut && (
                                        <p className="text-xs text-yellow-400">Timed out.</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500">Run your code to see output here.</p>
                            )}
                        </div>
                        <div className={tab === "analysis" ? "" : "hidden"}>
                           {problem && <CodeAnalysis code={code} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}