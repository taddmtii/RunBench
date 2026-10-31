"use client"

import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import { ChevronDown, Play, Check, LoaderCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Problem, Submission, TestCase } from "../../generated/prisma/client"
import ResultsPanel, { type RunResult } from "./ResultsPanel"


interface CodeEditorProps {
    problem: Problem & { testCases: TestCase[] }
    onSubmission: (submission: Submission) => void
}

const LANGUAGES = [
    { label: "Python", value: "python" },
    { label: "TypeScript", value: "typescript" },
    { label: "JavaScript", value: "javascript" },
]


export default function CodeEditor({ problem, onSubmission }: CodeEditorProps) {
    const [language, setLanguage] = useState("python")
    const [code, setCode] = useState( (problem?.functionStubs as Record<string, string>)?.["python"] ?? "")
    const [showPanel, setShowPanel] = useState(false)
    const [tab, setTab] = useState<"results" | "analysis">("results")
    const [result, setResult] = useState<RunResult>()
    const [processing, setProcessing] = useState<"run" | "submit" | null>(null)

    const handleRunClick = async () => {
        try {
            setProcessing("run")
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
        } catch {
            console.error("Something went wrong with Run.")
            return
        } finally {
            setProcessing(null)
        }
        
    }

    const handleSubmitClick = async () => {
        try {
            setProcessing("submit")
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
            if (data.totalCount > 0 && data.passedCount === data.totalCount) {
                const saved = await fetch("/api/submissions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problemId: problem.id, rawCode: code, language, accepted: true }),
                })
                if (saved.ok) onSubmission(await saved.json())
            }
        } catch {
            console.error("Something went wrong with Submit.")
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className="flex h-full min-h-0 min-w-0 flex-col gap-3">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e]">
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
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
                                    <DropdownMenuItem key={lang.value} onClick={() => {
                                        setLanguage(lang.value)
                                        setCode((problem.functionStubs as Record<string, string>)?.[lang.value] ?? "")
                                    }}>
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
                            disabled={processing !== null}
                            onClick={handleRunClick}
                            className="cursor-pointer gap-2 border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
                        >
                            <Play className="size-3.5" />
                            {processing === "run" ? "Running..." : "Run"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSubmitClick}
                            disabled={processing !== null}
                            className="cursor-pointer gap-2 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                        >
                            {processing === "submit" ? <LoaderCircle className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                            {processing === "submit" ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>

                <div className="relative min-h-0 min-w-0 flex-1">
                                    <div className="absolute inset-0">
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
            </div>

            {showPanel && (
                <ResultsPanel
                    code={code}
                    result={result}
                    tab={tab}
                    onTabChange={setTab}
                    onClose={() => setShowPanel(false)}
                />
            )}
        </div>
    )
}