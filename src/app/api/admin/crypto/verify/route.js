import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { orderId, action } = await req.json();

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (action === "approve") {
      await prisma.escrowOrder.update({
        where: { id: orderId },
        data: {
          cryptoVerified: true,
          status: "PAYMENT_AUTHORIZED",
        },
      });

      // 🔥 OPTIONAL: Add ledger entry
      await prisma.escrowLedger.create({
        data: {
          orderId,
          type: "PAYMENT_AUTHORIZED",
          amount: order.amount,
        },
      });
    }

    if (action === "reject") {
      await prisma.escrowOrder.update({
        where: { id: orderId },
        data: {
          cryptoSubmitted: false,
          cryptoVerified: false,
          cryptoTxHash: null,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}