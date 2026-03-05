import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { name, summary, icon, categoryId } = await request.json();

        if(!name || !summary) {
            return NextResponse.json({ error: "Name and Summary is required" }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                name, 
                summary, 
                icon
            }
        });

        return NextResponse.json({ success: true, message: "Category updated successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Category not updated" }, { status: 400 });
    }
}