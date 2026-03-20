export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session.user.id;

        const token = crypto.randomBytes(16).toString("hex");

        await prisma.telegramVerification.create({
            data: {
                token,
                userId
            }
        });

        return NextResponse.json({ token }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}