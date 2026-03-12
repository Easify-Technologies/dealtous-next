import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req) {

  const { orderId } = await req.json();

  const order = await prisma.escrowOrder.findUnique({
    where: { id: orderId }
  });

  if (order.status !== "BUYER_CONFIRMED") {
    return Response.json({ error: "Buyer not confirmed" });
  }

  const paymentIntent = await stripe.paymentIntents.capture(
    order.stripePaymentIntentId
  );

  await prisma.escrowOrder.update({
    where: { id: orderId },
    data: {
      status: "RELEASE_READY",
      releaseAfter: new Date(Date.now() + 48 * 60 * 60 * 1000)
    }
  });

  return Response.json(paymentIntent);
}