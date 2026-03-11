
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req) {

  const { orderId } = await req.json();

  const order = await prisma.escrowOrder.findUnique({
    where: { id: orderId }
  });

  const paymentIntent = await stripe.paymentIntents.capture(
    order.stripePaymentIntentId
  );

  await prisma.escrowOrder.update({
    where: { id: orderId },
    data: { status: "CAPTURED" }
  });

  return Response.json(paymentIntent);
}