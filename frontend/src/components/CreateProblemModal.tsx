"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GeneratedProblem {
  description: string;
  difficulty: string;
  topic: string;
  recommendedTimeComplexity: string;
  recommendedSpaceComplexity: string;
  examples: { input: string; output: string; explanation?: string }[];
  functionName: string;
  functionStubs: Record<string, string>;
  testCases: { input: string; expectedOutput: string }[];
}

export default function CreateProblemModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState<GeneratedProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/generateProblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error();
      const problem = await response.json();
      setGenerated(problem);
      setDescription(problem.description);
    } catch {
      setError("Could not generate the problem. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!generated) return generate();

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, ...generated, description }),
      });
      if (!response.ok) throw new Error();
      const problem = await response.json();
      router.push(`/problems/${problem.id}`);
    } catch {
      setError("Could not create the problem.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={onClose}>
      <form
        onSubmit={create}
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Create a problem</h2>
            <p className="mt-1 text-sm text-muted-foreground">AI will generate stubs and test cases.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Title
            <input
              required
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setGenerated(null);
              }}
              placeholder="Merge Intervals"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block text-sm font-medium">
            Context <span className="font-normal text-muted-foreground">(optional)</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the behavior or constraints..."
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        {generated && (
          <div className="mt-6 space-y-6 border-t border-border pt-6 text-sm">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2.5 py-1">{generated.difficulty}</span>
              <span className="rounded-full bg-muted px-2.5 py-1">{generated.topic}</span>
              <span className="rounded-full bg-muted px-2.5 py-1">Time: {generated.recommendedTimeComplexity}</span>
              <span className="rounded-full bg-muted px-2.5 py-1">Space: {generated.recommendedSpaceComplexity}</span>
            </div>

            <section>
              <h3 className="mb-3 font-medium">Examples</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {generated.examples.map((example, index) => (
                  <div key={index} className="rounded-lg bg-muted p-3">
                    <p className="mb-2 font-medium">Example {index + 1}</p>
                    <p><span className="text-muted-foreground">Input: </span>{example.input}</p>
                    <p><span className="text-muted-foreground">Output: </span>{example.output}</p>
                    {example.explanation && <p className="mt-1 text-muted-foreground">{example.explanation}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-medium">Function: <code>{generated.functionName}</code></h3>
              <div className="space-y-3">
                {Object.entries(generated.functionStubs).map(([language, stub]) => (
                  <div key={language}>
                    <p className="mb-1 capitalize text-muted-foreground">{language}</p>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{stub}</pre>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-medium">Test cases ({generated.testCases.length})</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {generated.testCases.map((testCase, index) => (
                  <div key={index} className="rounded-lg bg-muted p-3 font-mono text-xs">
                    <p className="mb-2 font-sans font-medium">Case {index + 1}</p>
                    <p><span className="text-muted-foreground">Input: </span>{JSON.stringify(testCase.input)}</p>
                    <p><span className="text-muted-foreground">Expected: </span>{testCase.expectedOutput}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          {!generated && (
            <Button type="button" disabled={loading || !title.trim()} onClick={generate}>
              <Sparkles /> {loading ? "Generating…" : "Generate"}
            </Button>
          )}
          {generated && (
            <>
              <Button type="button" variant="outline" disabled={loading} onClick={generate}>
                <Sparkles /> {loading ? "Regenerating…" : "Regenerate"}
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={loading}>Create problem</Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
