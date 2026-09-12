// Helper for JWT authentication to use in routes.
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User } from "../../generated/prisma/client";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken(user: User) {
  return jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: "30m" });
}

export function generateRefreshToken(user: User) {
  return jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}

// Attaches both access and refresh token as cookies to response.
export function attachAuthCookies(response: NextResponse, user: User) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30, // 30 min in seconds
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 604800, // 7 days in seconds
    path: "/",
  });

  return response;
}
