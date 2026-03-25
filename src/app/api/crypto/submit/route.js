import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { orderId, txHash, currency, network, screenshotUrl } = await req.json();

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ❌ Prevent duplicate submission
    if (order.cryptoSubmitted) {
      return NextResponse.json(
        { error: "Payment already submitted" },
        { status: 400 }
      );
    }

    // ❌ Prevent reused TX hash
    const existing = await prisma.escrowOrder.findFirst({
      where: { cryptoTxHash: txHash },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Transaction already used" },
        { status: 400 }
      );
    }

    // ✅ Save proof
    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: {
        paymentMethod: "CRYPTO",
        cryptoTxHash: txHash,
        cryptoCurrency: currency,
        cryptoNetwork: network,
        cryptoProofScreenshot: screenshotUrl,
        cryptoSubmitted: true,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}