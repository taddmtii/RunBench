import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, language, functionName, testCases } = body;
  if (!code || !testCases || !functionName || !language) {
    return NextResponse.json(
      { message: "There was a problem with the request" },
      { status: 400 },
    );
  }
  // Send code to Go service. This should execute code in the sandboxed execution environment and
  // run any associated test cases
  const res = await fetch("http://localhost:8080/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
      functionName: functionName,
      language: language,
      testCases: testCases,
    }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
