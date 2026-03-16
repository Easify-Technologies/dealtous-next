import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const seller = await prisma.seller.findUnique({
      where: { id: order.sellerId }
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    if (order.status !== "RELEASE_READY") {
      return NextResponse.json({ error: "Order not ready for payout" }, { status: 400 });
    }

    if (order.releaseAfter > new Date()) {
      return NextResponse.json({ error: "Escrow hold active" }, { status: 400 });
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round(order.amount * 100),
      currency: "usd",
      destination: seller.stripeAccountId
    });

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: {
        stripeTransferId: transfer.id,
        status: "RELEASED",
        payoutStatus: "PAID"
      }
    });

    return NextResponse.json({ transfer, message: "Fund Transfer Completed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}