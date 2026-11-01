"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import type { Problem, ProblemExample, Submission, TestCase } from "../../../../generated/prisma/client";
import CodeEditor from "@/components/CodeEditor";
import ProblemDetailsPanel from "@/components/ProblemDetailsPanel";
import SubmissionsPanel from "@/components/SubmissionsPanel";

type ProblemWithDetails = Problem & {
  examples: ProblemExample[];
  testCases: TestCase[];
};

export default function Problem() {
    const [problem, setProblem] = useState<ProblemWithDetails | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const { problemId } = useParams();

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
    <div className="grid h-full grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-4 lg:grid-rows-1 lg:overflow-hidden">
      <ProblemDetailsPanel problem={problem} loading={loading} />

      {/* Editor */}
      <div className="h-[70dvh] min-h-96 min-w-0 overflow-hidden rounded-lg border lg:col-span-2 lg:h-full lg:min-h-0">
        {problem && <CodeEditor problem={problem} onSubmission={(submission) => setSubmissions((current) => [submission, ...current])} />}
      </div>

      {/* Submissions Panel */}
      <SubmissionsPanel
        key={String(problemId)}
        submissions={submissions}
        onSubmissionUpdated={(updated) => setSubmissions((current) =>
          current.map((submission) => submission.id === updated.id ? updated : submission)
        )}
      />
    </div>
  );

}