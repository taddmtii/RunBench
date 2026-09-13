import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;
  // Send code to Go service.
  return NextResponse.json({ message: "Sucesss" }, { status: 200 });
}
