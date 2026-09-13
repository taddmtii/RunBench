import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const accessToken = request.cookies.get("accessToken")?.value;

  let isAuthenticated = false;
  if (accessToken) {
    try {
      verifyAccessToken(accessToken);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isPublicPath && !isAuthenticated) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
