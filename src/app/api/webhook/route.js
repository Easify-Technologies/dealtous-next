import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";


export const runtime = "nodejs";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const data = event.data.object;

  try {
    switch (event.type) {

      /**
       * Seller onboarding update (Stripe Connect)
       */
      case "account.updated": {

        const account = data;

        if (account.charges_enabled && account.payouts_enabled) {

          await prisma.seller.updateMany({
            where: {
              stripeAccountId: account.id,
            },
            data: {
              onboardingComplete: true,
            },
          });

          console.log("✅ Seller onboarding completed:", account.id);
        }

        break;
      }

      /**
       * Chargeback / dispute created
       */
      case "charge.dispute.created": {

        const dispute = data;

        const order = await prisma.escrowOrder.findFirst({
          where: {
            stripePaymentIntentId: dispute.payment_intent,
          },
        });

        if (!order) break;

        await prisma.dispute.create({
          data: {
            orderId: order.id,
            openedBy: "STRIPE",
            reason: dispute.reason || "Chargeback",
            status: "OPEN",
          },
        });

        await prisma.escrowOrder.update({
          where: {
            id: order.id,
          },
          data: {
            status: "DISPUTE",
          },
        });

        console.log("⚠️ Dispute opened for order:", order.id);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}