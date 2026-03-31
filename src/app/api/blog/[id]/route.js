import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const blog = await prisma.blogs.findUnique({
            where: {
                id
            }
        });

        return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Blog not found" }, { status: 500 });
    }
}