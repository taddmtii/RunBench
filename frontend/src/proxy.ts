import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    if (!accessToken) throw new Error();
    verifyAccessToken(accessToken);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/problems/:path*"],
};
