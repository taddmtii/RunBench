"use client"

import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Target, Layers } from "lucide-react";
import Card from "@/components/Card";
import StepCard from "@/components/StepCard";
import { useAuth } from "./contexts/authContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-foreground">RunBench</span>
        </Link>

        {isLoading && (
          <Skeleton className="h-4 w-[120px] rounded-full" />
        )}
        {!isLoading && user && (
          <div className="flex items-center gao-4">
             <div className="font-bold">Welcome back, {user?.firstName}!</div>
             <Button variant="destructive" className="cursor-pointer" onClick={logout}>Logout</Button>
          </div>
         
        )}
        {!isLoading && !user && (
          <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
        )}
      
      </nav>
      
      <section className="container mx-auto flex flex-col items-center px-6 pt-16 pb-20 text-center md:pt-24 md:pb-28">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Master coding through
          <span className="text-muted-foreground"> deliberate practice</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          RunBench is a coding practice platform powered by spaced repetition.
          Solve problems, get AI-driven complexity analysis, and track progress
          with intelligent scheduling.
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card
            icon={<Zap className="h-5 w-5" />}
            title="Instant Execution"
            description="Run your code in a sandboxed environment with CPU and memory limits."
          />
          <Card
            icon={<Target className="h-5 w-5" />}
            title="AI Complexity Analysis"
            description="Get asynchronous time and space complexity analysis after every submission."
          />
          <Card
            icon={<Layers className="h-5 w-5" />}
            title="Spaced Repetition"
            description="SM2-powered scheduling resurfaces problems at optimal retention intervals."
          />
          <Card
            icon={<Shield className="h-5 w-5" />}
            title="Secure & Reliable"
            description="Isolated execution with strict sandboxing keeps your system safe."
          />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <StepCard
            number="1"
            title="Sign Up"
            description="Create your account and choose your preferred language."
          />
          <StepCard
            number="2"
            title="Solve Problems"
            description="Write and run code against test cases in the Monaco editor."
          />
          <StepCard
            number="3"
            title="Track Progress"
            description="Review your submissions, notes, and spaced repetition schedule."
          />
        </div>
      </section>
    </div>
  );
}

