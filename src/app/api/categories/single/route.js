import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request) {
    try {
        const { categoryId } = await request.json();

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });

        return NextResponse.json({ category }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Category not updated" }, { status: 400 });
    }
}