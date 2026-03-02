import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                currency: true,
                images: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}