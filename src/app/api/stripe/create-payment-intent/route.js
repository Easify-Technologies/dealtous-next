import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  const { productId, buyerId } = await req.json();

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const order = await prisma.escrowOrder.create({
    data: {
      productId,
      buyerId,
      sellerId: product.vendorId,
      amount: product.price,
      status: "PENDING"
    }
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(product.price * 100),
    currency: "usd",
    capture_method: "manual",
    metadata: {
      orderId: order.id
    }
  });

  await prisma.escrowOrder.update({
    where: { id: order.id },
    data: {
      stripePaymentIntentId: paymentIntent.id,
      status: "PAYMENT_AUTHORIZED"
    }
  });

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id
  });
}