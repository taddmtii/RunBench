import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> },
) {
  const { problemId } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  });

  if (!problem) {
    return NextResponse.json({ message: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json(problem);
}
