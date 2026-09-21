"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CodeAnalysisProps {
    code: string
}

interface AIResponse {
    timeComplexity: string
    spaceComplexity: string
    explanation: string
}

export default function CodeAnalysis({ code }: CodeAnalysisProps) {
    const [loading, setLoading] = useState(false) 
    const [error, setError] = useState(false)
    const [data, setData] = useState<AIResponse | null>(null)

    const analyze = async () => {
        setLoading(true)
        setError(false)
        try {
            const res = await fetch("/api/ai/complexity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            })
            if (!res.ok) throw new Error("Analysis failed")
            setData(await res.json())
        } catch (e) {
            console.error(e)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-start gap-3">
            {data && (
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2">
                            <div className="text-xs text-zinc-400">Time</div>
                            <div className="font-mono text-base text-white">{data.timeComplexity}</div>
                        </div>
                        <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2">
                            <div className="text-xs text-zinc-400">Space</div>
                            <div className="font-mono text-base text-white">{data.spaceComplexity}</div>
                        </div>
                    </div>
                    <p className="max-w-prose leading-relaxed text-zinc-300">{data.explanation}</p>
                </div>
            )}

            {!data && !loading && !error && (
                <p className="text-zinc-400">Get the time and space complexity of your code, with a short explanation.</p>
            )}
            {error && <p className="text-red-400">Error when trying to analyze your code. The model could be busy, plesae try again later.</p>}

            <Button
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={analyze}
                className="cursor-pointer border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
            >
                {loading ? "Analyzing…" : data ? "Analyze again" : "Analyze code"}
            </Button>
        </div>
    )
}