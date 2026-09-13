"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useProblems } from "../hooks/useProblems";

export default function Problems() {
  const { data } = useProblems();

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10">
      <div className="mx-auto max-w-5xl">
        <section className="mt-16">
          <h1 className="text-4xl font-semibold">Problems</h1>
          <div className="mt-8 flex max-w-md items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Search size={17} className="text-muted-foreground" />
            <input
              type="search"
              placeholder="Search problems"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[1fr_120px_140px] border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Topic</span>
          </div>
          {data?.map((problem) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="grid grid-cols-[1fr_120px_140px] items-center border-b border-border px-5 py-5 transition hover:bg-muted"
            >
              <span className="text-sm font-medium">{problem.title}</span>
              <span className="text-sm text-muted-foreground">
                {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
              </span>
              <span className="text-sm text-muted-foreground">{problem.topic}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}