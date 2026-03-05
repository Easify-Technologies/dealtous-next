import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json({ error: "Missing userId or code" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.isVerified) return NextResponse.json({ message: "Already verified" });

    if (user.verifyCode !== code || new Date() > user.codeExpiry) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true, verifyCode: null, codeExpiry: null },
    });

    return NextResponse.json({ message: "User verified successfully. You can now log in." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
