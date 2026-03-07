import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const userId = params.id;

        const products = await prisma.product.findMany({
            where: {
                vendorId: userId
            },
            select: {
                id: true,
                name: true,
                summary: true,
                category: true,
                currency: true,
                subscribers: true,
                engagementRate: true,
                language: true,
                postingFrequency: true,
                monetizationMethods: true,
                averageViews: true,
                price: true,
                images: true,
                status: true
            }
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}