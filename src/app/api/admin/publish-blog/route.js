import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { blogId } = await request.json();

        const blog = await prisma.blogs.update({
            where: {
                id: blogId
            },
            data: {
                status: "Published"
            }
        });

        return NextResponse.json({ message: "Blog published successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}