// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { User } from "../../../../generated/prisma/client";
import { generateAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET, PATCH, POST } from "./route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    submission: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));

const findMany = vi.mocked(prisma.submission.findMany);
const create = vi.mocked(prisma.submission.create);
const update = vi.mocked(prisma.submission.update);

const token = generateAccessToken({ id: "user-123" } as User);

function makeRequest(
  method: string,
  {
    body,
    search = "",
    signedIn = true,
  }: { body?: unknown; search?: string; signedIn?: boolean } = {},
) {
  return new NextRequest(`http://localhost:3000/api/submissions${search}`, {
    method,
    headers: signedIn ? { cookie: `accessToken=${token}` } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("GET /api/submissions", () => {
  it("returns 401 when signed out", async () => {
    const request = makeRequest("GET", {
      search: "?problemId=p-1",
      signedIn: false,
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("returns 400 without a problemId", async () => {
    const request = makeRequest("GET");
    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it("only returns the signed-in user's accepted submissions", async () => {
    findMany.mockResolvedValue([]);
    const request = makeRequest("GET", { search: "?problemId=p-1" });
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith({
      where: { userId: "user-123", problemId: "p-1", accepted: true },
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("POST /api/submissions", () => {
  it("returns 400 when the submission is not accepted", async () => {
    const request = makeRequest("POST", {
      body: {
        problemId: "p-1",
        rawCode: "code",
        language: "python",
        accepted: false,
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  it("saves under the signed-in user even if the body names someone else", async () => {
    create.mockResolvedValue({ id: "s-1" } as never);
    const request = makeRequest("POST", {
      body: {
        userId: "someone-else",
        problemId: "p-1",
        rawCode: "code",
        language: "python",
        accepted: true,
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        problemId: "p-1",
        rawCode: "code",
        language: "python",
        runtime: 0,
        accepted: true,
      },
    });
  });
});

describe("PATCH /api/submissions", () => {
  it("returns 400 when notes is not a string", async () => {
    const request = makeRequest("PATCH", {
      body: { submissionId: "s-1", notes: 42 },
    });

    const response = await PATCH(request);

    expect(response.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it("only updates a submission owned by the signed-in user", async () => {
    update.mockResolvedValue({ id: "s-1", notes: "new notes" } as never);
    const request = makeRequest("PATCH", {
      body: { submissionId: "s-1", notes: "new notes" },
    });

    const response = await PATCH(request);

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({
      where: { id: "s-1", userId: "user-123" },
      data: { notes: "new notes" },
    });
  });

  it("returns 400 when the submission belongs to someone else", async () => {
    update.mockRejectedValue(new Error("Record to update not found"));
    const request = makeRequest("PATCH", {
      body: { submissionId: "s-1", notes: "new notes" },
    });

    const response = await PATCH(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Could not save notes" });
  });
});
