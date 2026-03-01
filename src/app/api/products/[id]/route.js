import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, description, price, images } = await request.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: Number(price),
        images,
      },
    });
    return NextResponse.json({
      message: "Product updated",
      product,
    });
  } catch (error) {}
}

export async function DELETE(request, { params }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Product deleted",
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}