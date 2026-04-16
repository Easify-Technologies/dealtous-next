import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const sales = await prisma.product.findMany({
            where: {
                isSold: true
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                    },
                },

                orders: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        status: true,
                        amount: true,

                        buyer: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },

                        seller: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedSales = sales.map((p) => {
            const latestSales = p.orders?.[0];

            return {
                ...p,
                sellerName:
                    latestSales?.seller?.name ??
                    p.vendor?.name ??
                    "Unknown Seller",

                buyerName: latestSales?.buyer?.name ?? "No Buyer",
            };
        });

        return NextResponse.json({ sales: formattedSales }, { status: 200 });
    } catch (error) {
        console.error("Error fetching total sales", error);
        return NextResponse.json({ error: "Failed to fetch total sales" }, { status: 500 });
    }
}
