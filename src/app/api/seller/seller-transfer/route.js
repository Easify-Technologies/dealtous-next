import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    const escrow = await prisma.escrowOrder.update({
      where: {
        id: orderId
      },
      data: {
        status: "SELLER_TRANSFER_PENDING"
      }
    });

    return NextResponse.json({ escrow, message: "Seller marked the product" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
