import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;
  if (!code) {
    return NextResponse.json(
      { message: "There was a problem with the request" },
      { status: 400 },
    );
  }
  // Send code to Go service.
  return NextResponse.json({ message: "Sucesss" }, { status: 200 });
}
