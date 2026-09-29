import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyAccessToken(accessToken);
    const problemId = request.nextUrl.searchParams.get("problemId");
    if (!problemId) return NextResponse.json({ error: "Problem is required" }, { status: 400 });

    const submissions = await prisma.submission.findMany({
      where: { userId, problemId, accepted: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = verifyAccessToken(accessToken);
    const { problemId, rawCode, language, runtime = 0, accepted } = await request.json();
    if (!problemId || !rawCode || !language || accepted !== true) {
      return NextResponse.json({ error: "Missing submission data" }, { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: { userId, problemId, rawCode, language, runtime, accepted: true },
    });
    return NextResponse.json(submission, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save submission" }, { status: 400 });
  }
}
