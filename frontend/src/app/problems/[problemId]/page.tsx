"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import type { Problem } from "../../../../generated/prisma/client";

export default function Problem() {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useParams();
    const { problemId } = router;
    useEffect(() => {
        const fetchProblem = async () => {
        try {
            const res = await fetch(`/api/problems/${problemId}`)
        
        if (!res.ok) {
            console.error("Could not retrieve problem")
            return
        }
            const data = await res.json()
            setProblem(data)
        } catch (e) {
            console.error("Could not retrieve problem")
        } finally {
            setLoading(false)
        }
        }

        if (problemId) {
            fetchProblem()
        }
       
    }, [problemId])
    return (
        <>
        {problem?.title}
        </>
    )
}