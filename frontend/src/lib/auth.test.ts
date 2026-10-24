// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import type { User } from "../../generated/prisma/client";
import {
  attachAuthCookies,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./auth";

const user = { id: "user-123" } as User;

afterEach(() => {
  vi.useRealTimers();
});

describe("access tokens", () => {
  it("verifies a token it generated and returns the userId", () => {
    const token = generateAccessToken(user);
    const payload = verifyAccessToken(token);
    expect(payload.userId).toBe("user-123");
  });

  it("rejects a token after 30 minutes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const token = generateAccessToken(user);
    vi.setSystemTime(new Date("2026-01-01T00:31:00Z"));
    const act = () => verifyAccessToken(token);
    expect(act).toThrow("jwt expired");
  });

  it("rejects a refresh token", () => {
    const refreshToken = generateRefreshToken(user);
    const act = () => verifyAccessToken(refreshToken);
    expect(act).toThrow("invalid signature");
  });
});

describe("refresh tokens", () => {
  it("verifies a token it generated and returns the userId", () => {
    const token = generateRefreshToken(user);
    const payload = verifyRefreshToken(token);
    expect(payload.userId).toBe("user-123");
  });
});

describe("attachAuthCookies", () => {
  it("sets httpOnly access and refresh cookies with their lifetimes", () => {
    const response = NextResponse.json({});
    attachAuthCookies(response, user);

    const accessCookie = response.cookies.get("accessToken");
    const refreshCookie = response.cookies.get("refreshToken");
    expect(accessCookie).toMatchObject({
      httpOnly: true,
      maxAge: 60 * 30,
      path: "/",
    });
    expect(refreshCookie).toMatchObject({
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    expect(verifyAccessToken(accessCookie!.value).userId).toBe("user-123");
    expect(verifyRefreshToken(refreshCookie!.value).userId).toBe("user-123");
  });
});
