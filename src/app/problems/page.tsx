"use client"

import { Problem } from "../../../generated/prisma/client";
import { useProblems } from "../hooks/useProblems"

export default function Problems() {

  const { data, isLoading, error } = useProblems();
  return (
    <div>
      {data?.map((problem: Problem) => (
        <></>
      )

      )}
    </div>
  )
}