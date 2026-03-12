import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ================= VERIFY EMAIL =================
export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User with this email does not exist" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Email verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to verify email" },
            { status: 500 }
        );
    }
}

// ================= UPDATE PASSWORD =================
export async function PUT(request) {
    try {
        const { email, confirmPassword, password } = await request.json();

        if (!confirmPassword || !password) {
            return NextResponse.json(
                { error: "Password and Confirm Password are required" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Password does not match" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}
