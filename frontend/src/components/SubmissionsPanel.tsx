"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import type { Submission } from "../../generated/prisma/client";
import { Button } from "@/components/ui/button";

interface SubmissionsPanelProps {
  submissions: Submission[];
  onSubmissionUpdated: (submission: Submission) => void;
}

export default function SubmissionsPanel({ submissions, onSubmissionUpdated }: SubmissionsPanelProps) {
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [notes, setNotes] = useState<string | null>(null);

    async function onNotesSave() {
      if (!selectedSubmission) return
      try {
        const res = await fetch("/api/submissions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId: selectedSubmission.id, notes }),
        })
        if (!res.ok) {
          console.error("Error saving notes to submission.")
          return
        }
        const data = await res.json()
        setSelectedSubmission(data)
        onSubmissionUpdated(data)
      }
      catch {
        console.error("Error saving notes to submission.")
        return
      }
    }

  return (
      <div className="min-h-0 overflow-y-auto rounded-lg border bg-[#1e1e1e] p-4">
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
              <textarea value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} rows={6} className="mt-2 w-full resize-none rounded-lg border bg-background p-3 font-normal outline-none" />
            </label>
            <Button variant="outline" onClick={onNotesSave}>
              Save
            </Button>
          </div>
        ) : (
          <>
            <h2 className="mb-4 font-semibold">Accepted submissions</h2>
            <div className="space-y-3">
              {submissions.map((submission) => (
                <button key={submission.id} onClick={() => {
                  setSelectedSubmission(submission)
                  setNotes(submission.notes ?? "")
                }} className="w-full cursor-pointer rounded-lg border bg-[#242424] p-3 text-left text-sm hover:bg-muted">
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
  );
}
