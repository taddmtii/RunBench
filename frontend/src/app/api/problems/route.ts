import { prisma } from "@/lib/prisma";
import { Prisma } from "../../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const problems = await prisma.problem.findMany();
  return NextResponse.json(problems);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.title?.trim() || !body.functionName || !body.functionStubs || !body.testCases?.length) {
    return NextResponse.json({ error: "Missing problem data" }, { status: 400 });
  }

  const problem = await prisma.problem.create({
    data: {
      title: body.title.trim(),
      description: body.description,
      difficulty: body.difficulty,
      topic: body.topic,
      recommendedTimeComplexity: body.recommendedTimeComplexity,
      recommendedSpaceComplexity: body.recommendedSpaceComplexity,
      functionName: body.functionName,
      functionStubs: body.functionStubs,
      testCases: {
        create: body.testCases.map((testCase: { input: unknown; expectedOutput: string }) => ({
          input: testCase.input as Prisma.InputJsonValue,
          expectedOutput: testCase.expectedOutput,
        })),
      },
    },
  });

  return NextResponse.json(problem, { status: 201 });
}
