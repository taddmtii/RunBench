import { NextRequest, NextResponse } from "next/server";
import { checkSyntax, parseErrorResponse } from "@/lib/checkSyntax";
import { verifyAccessToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { code, language } = await request.json();
  if (!code) {
    return NextResponse.json(
      { message: "There was a problem with the request" },
      { status: 400 },
    );
  }

  const isValid = verifyAccessToken(
    request.cookies.get("accessToken")?.value || "",
  );
  if (!isValid) {
    return NextResponse.json(
      { message: "Access token is missing, invalid, or expired." },
      { status: 401 },
    );
  }

  const syntaxError = checkSyntax(code, language);
  if (syntaxError) {
    return NextResponse.json(parseErrorResponse(syntaxError));
  }

  const res = await fetch("http://localhost:8080/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language }),
  });
  return NextResponse.json(await res.json());
}
