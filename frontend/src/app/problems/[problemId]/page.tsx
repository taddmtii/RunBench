"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import type { Problem } from "../../../../generated/prisma/client";
import CodeEditor from "@/components/CodeEditor";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="w-1/2 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        {loading ? (
          <div className="space-y-6">
            {/* Title and difficulty */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Topic */}
            <Skeleton className="h-5 w-1/3" />

            {/* Description  */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Examples. Maybe need to come back here and add a more dynamic array to map over for prioblems that have more than two exmaples */}
            <div className="mt-6 space-y-3">
              {[1,2].map((i) => (
                <div key={i} className="rounded-md border border-gray-800 p-4 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>

            {/* Time / Space Complexity */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{problem?.title}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  difficultyStyles[String(problem?.difficulty).toUpperCase()] ??
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
                    <div key={example.id} className="rounded-md border border-gray-200 dark:border-gray-800 p-4 text-sm">
                        <p className="mb-2 font-medium">Example {i + 1}</p>
                        <p className="font-mono">
                        <span className="text-gray-500 dark:text-gray-400">Input: </span>
                        {example.input}
                        </p>
                        <p className="font-mono">
                        <span className="text-gray-500 dark:text-gray-400">Output: </span>
                        {example.output}
                        </p>
                        {example.explanation && (
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            <span className="text-gray-500 dark:text-gray-400">Explanation: </span>
                            {example.explanation}
                        </p>
                        )}
                    </div>
                    ))}
                </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-800 pt-4 text-sm">
              <div>
                <span className="block">Reccomended Time complexity</span>
                <code className="font-mono">{problem?.recommendedTimeComplexity}</code>
              </div>
              <div>
                <span className="block">Reccomended Space complexity</span>
                <code className="font-mono">{problem?.recommendedSpaceComplexity}</code>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Editor */}
      <div className="w-1/2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <CodeEditor testCases={problem?.testCases ?? []} />
      </div>
    </div>
  );

}