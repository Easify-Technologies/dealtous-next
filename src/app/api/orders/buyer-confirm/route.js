import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {

  const body = await req.json();
  const { orderId } = body;

  const order = await prisma.escrowOrder.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
  }

  if (order.status !== "SELLER_TRANSFER_PENDING") {
    return new Response(JSON.stringify({ error: "Seller transfer not completed" }), { status: 400 });
  }

  await prisma.escrowOrder.update({
    where: { id: orderId },
    data: { status: "BUYER_CONFIRMED" }
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}