// @vitest-environment node
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import type { User } from "../generated/prisma/client";
import { generateAccessToken } from "@/lib/auth";
import { proxy } from "./proxy";

function requestWithCookie(cookie?: string) {
  return new NextRequest("http://localhost:3000/problems/abc", {
    headers: cookie ? { cookie } : {},
  });
}

describe("proxy", () => {
  it("redirects to /login when there is no access token", () => {
    const request = requestWithCookie();
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("redirects to /login when the access token is invalid", () => {
    const request = requestWithCookie("accessToken=not-a-real-jwt");
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("lets the request through when the access token is valid", () => {
    const token = generateAccessToken({ id: "user-123" } as User);
    const request = requestWithCookie(`accessToken=${token}`);
    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
