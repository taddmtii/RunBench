import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  attachAuthCookies,
  generateAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (refreshToken) {
      const { userId } = verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user === null) {
        return NextResponse.json(
          { error: "Cannot find user." },
          { status: 401 },
        );
      }
      const newAccessToken = generateAccessToken(user);
      const response = NextResponse.json({ success: true });
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30, // 30 min in seconds
        path: "/",
      });
      return response;
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
