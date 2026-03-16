import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                orders: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { id: true, status: true }
                }
            }
        });

        return NextResponse.json(
            { products },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
