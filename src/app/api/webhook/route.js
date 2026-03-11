import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const sig = req.headers["stripe-signature"];
  const body = await req.text(); // stripe requires raw body

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "account.updated") {
    const account = event.data.object;
    if (account.charges_enabled) {
      await prisma.seller.update({
        where: { stripeAccountId: account.id },
        data: { onboardingComplete: true },
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}