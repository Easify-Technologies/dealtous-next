import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { name, summary, icon } = await request.json();

        if(!name || !summary) {
            return NextResponse.json({ error: "Name and Summary is required" }, { status: 400 });
        }
        else {
            const category = await prisma.category.create({
                data: {
                    name,
                    summary,
                    icon
                }
            });

            return NextResponse.json({ message: "Category created successfully" }, { status: 201 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}