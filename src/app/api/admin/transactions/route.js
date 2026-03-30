import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const transactions = await prisma.escrowOrder.findMany({
            include: {
                product: {
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
                        approvedAt: true
                    },
                },
                buyer: {
                    select: {
                        name: true,
                    },
                },
                seller: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching transactions", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}