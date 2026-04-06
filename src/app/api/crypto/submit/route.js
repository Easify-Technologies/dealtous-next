import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, productId, txHash, currency, network, screenshotUrl } = await req.json();

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.buyerId !== session.user.id) {
      return NextResponse.json({ error: "Not your order" }, { status: 403 });
    }

    if (order.paymentMethod !== "CRYPTO") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    if (order.cryptoSubmitted) {
      return NextResponse.json(
        { error: "Payment already submitted" },
        { status: 400 }
      );
    }

    const existing = await prisma.escrowOrder.findFirst({
      where: { cryptoTxHash: txHash },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Transaction already used" },
        { status: 400 }
      );
    }

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: {
        cryptoTxHash: txHash,
        ...(currency && { cryptoCurrency: currency }),
        ...(network && { cryptoNetwork: network }),
        ...(screenshotUrl && { cryptoProofScreenshot: screenshotUrl }),
        cryptoSubmitted: true,
        status: "CRYPTO_SUBMITTED"
      }
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        isSold: true
      }
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}