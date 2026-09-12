import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "../../../../../generated/prisma/client";
import { attachAuthCookies } from "@/lib/auth";

interface SignUpUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const body: SignUpUser = await request.json();
  if (
    typeof body.email !== "string" ||
    typeof body.firstName !== "string" ||
    typeof body.lastName !== "string" ||
    typeof body.password !== "string" ||
    typeof body.username !== "string" ||
    !body.email.trim() ||
    !body.firstName.trim() ||
    !body.lastName.trim() ||
    !body.password.trim() ||
    !body.username.trim()
  ) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        email: body.email.trim(),
        username: body.username.trim(),
        hashedPassword: hashedPassword.trim(),
      },
    });
    const { hashedPassword: _, ...userWithoutPassword } = user;
    const response = NextResponse.json(userWithoutPassword);
    return attachAuthCookies(response, user);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email or username already in use" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Creation of User has failed." },
      { status: 500 },
    );
  }
}
