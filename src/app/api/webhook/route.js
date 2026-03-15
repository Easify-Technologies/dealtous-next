import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse({ error: err.message }, { status: 400 });
  }

  const data = event.data.object;

  switch (event.type) {

    case "account.updated":

      if (data.charges_enabled && data.payouts_enabled) {
        await prisma.seller.update({
          where: { stripeAccountId: data.id },
          data: { onboardingComplete: true }
        });
      }

      break;

    case "charge.dispute.created":

      const order = await prisma.escrowOrder.findFirst({
        where: { stripePaymentIntentId: data.payment_intent }
      });

      if (order) {
        await prisma.dispute.create({
          data: {
            orderId: order.id,
            openedBy: "STRIPE",
            reason: "Chargeback",
            status: "OPEN"
          }
        });

        await prisma.escrowOrder.update({
          where: { id: order.id },
          data: { status: "DISPUTE" }
        });
      }

      break;
  }

  return NextResponse.json({ received: true });
}