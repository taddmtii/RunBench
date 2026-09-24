"use client"

import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import { ChevronDown, Play, Check, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { TestCase } from "../../generated/prisma/client"
import CodeAnalysis from "./CodeAnalysis"

interface RunResult {
    stdout: string,
    stderr: string,
    exitCode: number,
    timedOut: boolean
}

interface CodeEditorProps {
    testCases: TestCase[]
}

const LANGUAGES = [
    { label: "Python", value: "python" },
    { label: "TypeScript", value: "typescript" },
    { label: "JavaScript", value: "javascript" },
    { label: "C++", value: "cpp" },
    { label: "C#", value: "csharp" },
]

export default function CodeEditor({ testCases }: CodeEditorProps) {
    const [language, setLanguage] = useState("python")
    const [code, setCode] = useState("")
    const [showPanel, setShowPanel] = useState(false)
    const [tab, setTab] = useState<"results" | "analysis">("results")
    const [result, setResult] = useState<RunResult>()
    const [processing, setProcessing] = useState(false)

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
            body: JSON.stringify({ code: code, language: language, testCases: testCases }),
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
                            <pre className="whitespace-pre-wrap font-mono text-xs">
                                {JSON.stringify(result?.stdout)}
                            </pre>
                        </div>
                        <div className={tab === "analysis" ? "" : "hidden"}>
                            <CodeAnalysis code={code} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}