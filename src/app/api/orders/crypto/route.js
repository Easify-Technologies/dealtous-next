import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const buyerId = session.user.id;

        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                vendor: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        const existingOrder = await prisma.escrowOrder.findFirst({
            where: {
                buyerId,
                productId,
                status: "PENDING",
            },
        });

        if (existingOrder) {
            return NextResponse.json({
                orderId: existingOrder.id,
            });
        }

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        if (!product.vendorId) {
            return NextResponse.json(
                { error: "Seller not found" },
                { status: 400 }
            );
        }

        // ❗ Prevent buying own product
        if (product.vendorId === buyerId) {
            return NextResponse.json(
                { error: "You cannot buy your own product" },
                { status: 400 }
            );
        }

        // 4️⃣ Create Escrow Order
        const order = await prisma.escrowOrder.create({
            data: {
                productId: product.id,
                buyerId,
                sellerId: product.vendorId,
                amount: product.price,

                paymentMethod: "CRYPTO",

                status: "PENDING",
                payoutStatus: "HOLD",

                cryptoSubmitted: false,
                cryptoVerified: false,
            },
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
        });

    } catch (error) {
        console.error("CRYPTO ORDER ERROR:", error);

        return NextResponse.json(
            { error: "Failed to create crypto order" },
            { status: 500 }
        );
    }
}