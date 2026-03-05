import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: "USER",
      },
      process.env.NEXTAUTH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
