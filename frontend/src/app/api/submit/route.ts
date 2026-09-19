import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { testCases, code } = body;
  if (!code || !testCases) {
    return NextResponse.json(
      { message: "There was a problem with the request" },
      { status: 400 },
    );
  }
  // Send code to Go service. This should execute code in the sandboxed execution environment and
  // run any associated test cases
  return NextResponse.json({ message: "Sucesss" }, { status: 200 });
}
