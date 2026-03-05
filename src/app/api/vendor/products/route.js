import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const user = verifyUser(request);
    const { id } = params;

    await prisma.product.delete({
      where: {
        id,
        vendorId: user.userId,
      },
    });

    return NextResponse.json({
      message: "Product deleted",
    });

  } catch (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

export async function GET(request) {
  try {
    const user = verifyUser(request);
    const products = await prisma.product.findMany({
      where: {
        vendorId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
