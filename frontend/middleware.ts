import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const isPublic = PUBLIC_PATHS.includes(pathname) || pathname === "/";
  const accessToken = request.cookies.get("accessToken")?.value;

  let isAuthenticated = false;
  if (accessToken) {
    try {
      verifyAccessToken(accessToken);
      isAuthenticated = true;
    } catch (e) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } finally {
      isAuthenticated = false;
    }
  }

  if (!isPublic && !isAuthenticated) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
