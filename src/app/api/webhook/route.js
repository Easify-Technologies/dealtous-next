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
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const data = event.data.object;

  // Ignore ping
  if (event.type === "v2.core.event_destination.ping") {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "account.updated":
      case "v2.core.account.updated":
      case "v2.core.account[identity].updated":
      case "v2.core.account[requirements].updated":
      case "v2.core.account[defaults].updated":
      case "v2.core.account[configuration.merchant].updated":
      case "v2.core.account[configuration.recipient].updated":
        const account = await stripe.accounts.retrieve(data.id);

        if (account.charges_enabled && account.payouts_enabled) {
          await prisma.seller.updateMany({
            where: { stripeAccountId: data.id },
            data: { onboardingComplete: true },
          });
        }

        break;

      case "charge.dispute.created":
        const order = await prisma.escrowOrder.findFirst({
          where: { stripePaymentIntentId: data.payment_intent },
        });

        if (order) {
          await prisma.dispute.create({
            data: {
              orderId: order.id,
              openedBy: "STRIPE",
              reason: "Chargeback",
              status: "OPEN",
            },
          });

          await prisma.escrowOrder.update({
            where: { id: order.id },
            data: { status: "DISPUTE" },
          });
        }

        break;
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
