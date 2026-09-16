import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // extract token from cookie to get user id.
  // server decodes token to get user id
  // server looks upuser in database
  // client stores using context so it is available anywhere.

  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "accessToken not found" },
        { status: 403 },
      );
    }
    // verify access token, then get user from userid
    let { userId } = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 },
    );
  }
}
