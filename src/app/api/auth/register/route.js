import prisma from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, username, email, password } = await request.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Something is missing" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 19);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        codeExpiry: expiry,
        isVerified: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Dealtous" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your account",
      text: `Your verification code is ${verifyCode}`,
    });

    console.log("Email sent:", info.messageId);

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: "User created. Email sent.",
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
