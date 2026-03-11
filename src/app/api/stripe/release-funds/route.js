import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req) {

  const { orderId } = await req.json();

  const order = await prisma.escrowOrder.findUnique({
    where: { id: orderId },
    include: { seller: true }
  });

  const transfer = await stripe.transfers.create({
    amount: Math.round(order.amount * 100),
    currency: "usd",
    destination: order.seller.stripeAccountId
  });

  await prisma.escrowOrder.update({
    where: { id: orderId },
    data: {
      stripeTransferId: transfer.id,
      status: "RELEASED"
    }
  });

  return Response.json(transfer);
}