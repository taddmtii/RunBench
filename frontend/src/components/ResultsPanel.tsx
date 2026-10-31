"use client"

import { X } from "lucide-react"
import CodeAnalysis from "./CodeAnalysis"
import { Button } from "./ui/button"

// Used for both run and submit. Optional fields are populated by submit only.
export interface RunResult {
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

type PanelTab = "results" | "analysis"

interface ResultsPanelProps {
    code: string
    result?: RunResult
    tab: "results" | "analysis"
    onTabChange: (tab: PanelTab) => void
    onClose: () => void
}

export default function ResultsPanel({ code, result, tab, onTabChange, onClose }: ResultsPanelProps) {
    return (
        <div className="flex h-100 shrink-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e]">
            <div className="flex items-center justify-between border-b border-zinc-800 px-2">
                <div className="flex">
                    <button
                        onClick={() => onTabChange("results")}
                        className={`mb-px cursor-pointer border-b-2 px-3 py-2 text-sm ${
                            tab === "results"
                                ? "border-emerald-500 text-white"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Results
                    </button>
                    <button
                        onClick={() => onTabChange("analysis")}
                        className={`mb-px cursor-pointer border-b-2 px-3 py-2 text-sm ${
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
                    onClick={onClose}
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
                                    className={`rounded border p-4 text-base ${
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
                                    {r.stderr && (
                                        <pre className="mt-1 whitespace-pre-wrap text-red-400">{r.stderr}</pre>
                                    )}
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
                    <CodeAnalysis code={code} />
                </div>
            </div>
        </div>
    )
}
