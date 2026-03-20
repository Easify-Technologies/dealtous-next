import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        const verification = await prisma.telegramVerification.findUnique({
            where: { token },
        });

        return NextResponse.json(verification);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}