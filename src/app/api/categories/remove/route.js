import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { categoryId } = await request.json();

        const removeCategory = await prisma.category.delete({
            where: {
                id: categoryId
            }
        });

        return NextResponse.json({ message: "Category removed successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Category cannot be removed" }, { status: 500 });
    }
}