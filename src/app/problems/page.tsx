"use client"

import { useEffect } from "react"
import { useProblems } from "../hooks/useProblems"

interface Problem {
  id: String,
  title: String,
  description: String
  difficulty: "EASY" | "MEDIUM" | "HARD",
  recommendedTimeComplexity: String,
  submissionCount: number
}

export default function Problems() {

  const { data } = useProblems();
  return (
    <></>
  )
}