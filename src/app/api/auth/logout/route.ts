import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
  response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

  return response;
}
