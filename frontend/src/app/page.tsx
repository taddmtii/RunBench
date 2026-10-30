"use client"

import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Target } from "lucide-react";
import Card from "@/components/Card";

import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="px-6 sm:px-10">
        <Navbar />
      </header>
      <section className="container mx-auto flex flex-col items-center px-6 pt-16 pb-20 text-center md:pt-24 md:pb-28">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Master coding through
          <span className="text-muted-foreground"> deliberate practice</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          RunBench is a coding practice platform for solving algorithm problems.
          Write and run code, then get AI-driven complexity analysis of your solution.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start Coding
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Play className="h-4 w-4" />
            Browse Problems
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Built for the grinder.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Everything you need to level up your problem solving game.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            icon={<Zap className="h-5 w-5" />}
            title="Instant & Secure Execution"
            description="Run your code in a sandboxed environment with CPU and memory limits, keeping your system safe."
          />
          <Card
            icon={<Target className="h-5 w-5" />}
            title="AI Complexity Analysis"
            description="Get asynchronous time and space complexity analysis after every submission."
          />
          <Card
            icon={<Shield className="h-5 w-5" />}
            title="Review Your Work"
            description="You can also review accepted submissions and save notes for later."
          />
        </div>
      </section>

    </div>
  );
}

