import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentMethod !== "CRYPTO") {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    if (order.status !== "BUYER_CONFIRMED") {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: {
        status: "RELEASE_READY",
        releaseAfter: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return NextResponse.json({
      message: "Crypto order moved to release stage",
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}