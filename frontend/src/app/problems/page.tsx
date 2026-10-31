"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useProblems } from "../hooks/useProblems";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";


export default function Problems() {
  const { data, isLoading } = useProblems();
  const [searchQuery, setSearchQuery] = useState("");


  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
  }

  const filtered = data?.filter((problem) => {
    return problem.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-full bg-background px-6 text-foreground sm:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="mt-16">
          <h1 className="text-4xl font-semibold">Problems</h1>
          <div className="mt-8 flex max-w-md items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Search size={17} className="text-muted-foreground" />
            <input
              type="search"
              placeholder="Search problems"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[1fr_120px_140px] border-b border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Topic</span>
          </div>
          {isLoading ? Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[1fr_120px_140px] items-center border-b border-border px-6 py-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          )) : filtered?.map((problem) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className="grid grid-cols-[1fr_120px_140px] items-center border-b border-border px-6 py-6 transition hover:bg-muted"
            >
              <span className="text-base font-medium">{problem.title}</span>
              <span className="text-base text-muted-foreground">
                {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
              </span>
              <span className="text-base text-muted-foreground">{problem.topic}</span>
            </Link>
          ))}
        </section>
      </div>

    </div>
  );
}