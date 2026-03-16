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

    if (order.status !== "BUYER_CONFIRMED") {
      return NextResponse.json({ error: "Buyer not confirmed" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );

    if (paymentIntent.status !== "requires_capture") {
      return NextResponse.json({
        error: `Cannot capture payment. Status: ${paymentIntent.status}`
      });
    }

    const captured = await stripe.paymentIntents.capture(
      order.stripePaymentIntentId
    );

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: {
        status: "RELEASE_READY",
        releaseAfter: new Date(Date.now() + 5 * 60 * 1000)
      }
    });

    return NextResponse.json({
      message: "Payment captured successfully",
      captured
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}