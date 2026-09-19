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
  // Send code to Go service. This only needs to execute code in the sandboxed execution environment and not
  // run any test cases. This route just acts as a proxy to send traffic to the microservice.
  // const res = fetch()
  return NextResponse.json({ message: "Sucesss" }, { status: 200 });
}
