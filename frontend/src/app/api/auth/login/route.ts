import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { attachAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  // Check if username and password match what is in db.
  const user = await prisma.user.findUnique({ where: { username } });
  if (user === null) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }
  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (isValid) {
    const { hashedPassword: _, ...userWithoutPassword } = user;
    const response = NextResponse.json(userWithoutPassword);
    return attachAuthCookies(response, user);
  }
  return NextResponse.json(
    { error: "Invalid username or password" },
    { status: 401 },
  );
}
