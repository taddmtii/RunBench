"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { ArrowLeft, Check } from "lucide-react";
import type { Problem, ProblemExample, Submission, TestCase } from "../../../../generated/prisma/client";
import CodeEditor from "@/components/CodeEditor";
import { Skeleton } from "@/components/ui/skeleton";

type ProblemWithDetails = Problem & {
  examples: ProblemExample[];
  testCases: TestCase[];
};

export default function Problem() {
    const [problem, setProblem] = useState<ProblemWithDetails | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const { problemId } = useParams();

    const difficultyStyles: Record<string, string> = {
        EASY: "bg-green-100 text-green-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        HARD: "bg-red-100 text-red-700",
    };


    useEffect(() => {

      const fetchSubmissions = async () => {
        try {
            const res = await fetch(`/api/submissions?problemId=${problemId}`)
            if (!res.ok) {
                console.error("Could not retrieve submissions")
                return
            }
            const data = await res.json()
            setSubmissions(data)
        } catch {
            console.error("Could not retrieve submissions")
        }
      }
        const fetchProblem = async () => {
        try {
            const res = await fetch(`/api/problems/${problemId}`)
        
        if (!res.ok) {
            console.error("Could not retrieve problem")
            return
        }
            const data = await res.json()
            setProblem(data)
        } catch {
            console.error("Could not retrieve problem")
        } finally {
            setLoading(false)
        }
        }

        if (problemId) {
            fetchProblem()
            fetchSubmissions()
        }
    }, [problemId])
      return (
    <div className="grid h-screen gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(280px,1fr)_minmax(420px,1.5fr)_minmax(240px,.7fr)] lg:overflow-hidden">
      <div className="overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 p-6">
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
      <div className="min-h-[520px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        {problem && <CodeEditor problem={problem} onSubmission={(submission) => setSubmissions((current) => [submission, ...current])} />}
      </div>

      <div className="overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        {selectedSubmission ? (
          <div className="space-y-5">
            <button onClick={() => setSelectedSubmission(null)} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Back
            </button>
            <div>
              <h2 className="mb-2 font-semibold">Submitted code</h2>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">{selectedSubmission.rawCode}</pre>
            </div>
            <label className="block text-sm font-medium">
              Notes
              <textarea defaultValue={selectedSubmission.notes ?? ""} rows={6} className="mt-2 w-full resize-none rounded-lg border border-border bg-background p-3 font-normal outline-none" />
            </label>
          </div>
        ) : (
          <>
            <h2 className="mb-4 font-semibold">Accepted submissions</h2>
            <div className="space-y-3">
              {submissions.map((submission) => (
                <button key={submission.id} onClick={() => setSelectedSubmission(submission)} className="w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-left text-sm hover:bg-muted dark:border-gray-800">
                  <span className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" /> Accepted <span className="capitalize">[{submission.language}]</span>
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{new Date(submission.createdAt).toLocaleString()}</span>
                </button>
              ))}
              {!submissions.length && <p className="text-sm text-muted-foreground">No accepted submissions yet.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );

}