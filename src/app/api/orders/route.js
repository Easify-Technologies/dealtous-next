import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get("buyerId");

    const role = session?.user?.role;
    const userId = session?.user?.id;

    if (!buyerId && role !== "Seller") {
      return NextResponse.json(
        { error: "buyerId is required" },
        { status: 400 }
      );
    }

    const whereCondition =
      role === "Seller"
        ? { sellerId: userId }
        : { buyerId };

    const orders = await prisma.escrowOrder.findMany({
      where: whereCondition,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
            images: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
