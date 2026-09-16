import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const problems = await prisma.problem.findMany();
  return NextResponse.json(problems);
}
