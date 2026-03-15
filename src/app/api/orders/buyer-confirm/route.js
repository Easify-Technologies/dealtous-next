import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const orderId = typeof body.orderId === "object"
      ? body.orderId.orderId
      : body.orderId;

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 400 });
    }

    if (order.status !== "SELLER_TRANSFER_PENDING") {
      return NextResponse.json(
        { error: "Seller transfer not completed" },
        { status: 400 }
      );
    }

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: { status: "BUYER_CONFIRMED" }
    });

    return NextResponse.json(
      { message: "Buyer Confirmed" },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
