"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import type { Problem } from "../../../../generated/prisma/client";
import CodeEditor from "@/components/CodeEditor";

export default function Problem() {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useParams();
    const { problemId } = router;

    const difficultyStyles: Record<string, string> = {
        EASY: "bg-green-100 text-green-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        HARD: "bg-red-100 text-red-700",
    };


    useEffect(() => {
        const fetchProblem = async () => {
        try {
            const res = await fetch(`/api/problems/${problemId}`)
        
        if (!res.ok) {
            console.error("Could not retrieve problem")
            return
        }
            const data = await res.json()
            setProblem(data)
        } catch (e) {
            console.error("Could not retrieve problem")
        } finally {
            setLoading(false)
        }
        }

        if (problemId) {
            fetchProblem()
        }
       
    }, [problemId])
   return (
    <div className="flex h-screen gap-4 p-4">
      <div className="w-1/2 overflow-y-auto rounded-lg border border-gray-200 p-6">
        <div className="mb-3 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{problem?.title}</h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              difficultyStyles[String(problem?.difficulty).toUpperCase()] ??
              "bg-gray-100 text-gray-700"
            }`}
          >
            {problem?.difficulty}
          </span>
        </div>

        <p className="mb-6 text-md">{problem?.topic}</p>

        <p className="whitespace-pre-wrap">
          {problem?.description}
        </p>

        {problem?.examples && (
            <div className="mt-6 space-y-4">
                {problem.examples.map((example, i) => (
                <div key={example.id} className="rounded-md border border-gray-200 p-4 text-sm">
                    <p className="mb-2 font-medium">Example {i + 1}</p>
                    <p className="font-mono">
                    <span className="text-gray-500">Input: </span>
                    {example.input}
                    </p>
                    <p className="font-mono">
                    <span className="text-gray-500">Output: </span>
                    {example.output}
                    </p>
                    {example.explanation && (
                    <p className="mt-1 text-gray-600">
                        <span className="text-gray-500">Explanation: </span>
                        {example.explanation}
                    </p>
                    )}
                </div>
                ))}
            </div>
        )}


        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 text-sm">
          <div>
            <span className="block">Reccomended Time complexity</span>
            <code className="font-mono">{problem?.recommendedTimeComplexity}</code>
          </div>
          <div>
            <span className="block">Reccomended Space complexity</span>
            <code className="font-mono">{problem?.recommendedSpaceComplexity}</code>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="w-1/2 overflow-hidden rounded-lg border border-gray-200">
        <CodeEditor />
      </div>
    </div>
  );

}