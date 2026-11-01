import type { Problem, ProblemExample } from "../../generated/prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ProblemDetailsPanelProps {
  problem: (Problem & { examples: ProblemExample[] }) | null;
  loading: boolean;
}

export default function ProblemDetailsPanel({ problem, loading }: ProblemDetailsPanelProps) {
    const difficultyStyles: Record<string, string> = {
        EASY: "bg-green-100 text-green-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        HARD: "bg-red-100 text-red-700",
    };

  return (
      <div className="min-h-0 overflow-y-auto rounded-lg border bg-[#1e1e1e] p-6">
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
                <div key={i} className="space-y-2 rounded-md border p-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>

            {/* Time / Space Complexity */}
            <div className="mt-6 space-y-3 border-t pt-5">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-7 w-20 rounded-md" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-7 w-20 rounded-md" />
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
                  "bg-muted text-muted-foreground"
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
                    <div key={example.id} className="rounded-md border bg-[#242424] p-4 text-sm">
                        <p className="mb-2 font-medium">Example {i + 1}</p>
                        <p className="font-mono">
                        <span className="text-muted-foreground">Input: </span>
                        {example.input}
                        </p>
                        <p className="font-mono">
                        <span className="text-muted-foreground">Output: </span>
                        {example.output}
                        </p>
                        {example.explanation && (
                        <p className="mt-1 text-muted-foreground">
                            Explanation: {example.explanation}
                        </p>
                        )}
                    </div>
                    ))}
                </div>
            )}

            <div className="mt-6 border-t pt-5 text-sm">
              <p className="mb-3 font-medium">Recommended complexity</p>
              <div className="w-fit max-w-full space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-12 text-muted-foreground">Time</span>
                  <span className="min-w-0 max-w-full wrap-break-word rounded-md bg-[#242424] px-2.5 py-1 font-mono text-xs">
                    {problem?.recommendedTimeComplexity || "Not specified"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-12 text-muted-foreground">Space</span>
                  <span className="min-w-0 max-w-full wrap-break-word rounded-md bg-[#242424] px-2.5 py-1 font-mono text-xs">
                    {problem?.recommendedSpaceComplexity || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
  );
}
