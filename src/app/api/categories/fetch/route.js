import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const category = await prisma.category.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ category }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Categories not found" }, { status: 400 });
    }
}