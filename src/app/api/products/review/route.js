import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { productId } = await request.json();

        const product = await prisma.product.update({
            where: { id: productId },
            data: { status: "PENDING_REVIEW" }
        });

        return NextResponse.json({ message: "Product reviewed successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}