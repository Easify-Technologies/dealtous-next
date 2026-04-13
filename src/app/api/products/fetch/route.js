import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
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

        const formattedProducts = products.map((p) => {
            const latestOrder = p.orders?.[0];

            return {
                ...p,
                sellerName:
                    latestOrder?.seller?.name ??
                    p.vendor?.name ??
                    "Unknown Seller",

                buyerName: latestOrder?.buyer?.name ?? "No Buyer",
            };
        });

        return NextResponse.json(
            { products: formattedProducts },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
