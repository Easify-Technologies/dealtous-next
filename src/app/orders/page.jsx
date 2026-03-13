import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Orders() {

  const orders = await prisma.escrowOrder.findMany({
    include: { product: true }
  });

  return (
    <div>
      <h1>Escrow Orders</h1>

      {orders.map(order => (
        <div key={order.id}>
          <h3>{order.product?.name}</h3>
          <p>Status: {order.status}</p>
          <p>Amount: ${order.amount}</p>
        </div>
      ))}

    </div>
  );
}