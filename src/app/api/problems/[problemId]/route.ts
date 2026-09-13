import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Missing 'id' query parameter" },
      { status: 400 },
    );
  }

  const problem = await prisma.problem.findUnique({ where: { id } });

  if (!problem) {
    return NextResponse.json({ message: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json(problem);
}
