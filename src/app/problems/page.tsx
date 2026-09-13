"use client"

import { useEffect } from "react"

interface Problem {
  id: String,
  title: String,
  description: String
  difficulty: "EASY" | "MEDIUM" | "HARD",
  recommendedTimeComplexity: String,
  submissionCount: number
}

export default function Problems() {

  useEffect(() => {
    
  }, [])
  return (
    <></>
  )
}