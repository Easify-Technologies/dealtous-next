import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, description, price, images } = await request.json();
    if (!name || !price || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Name, price, and images required" },
        { status: 400 },
      );
    }
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        images, // array of strings
      },
    });
    return NextResponse.json({
      message: "Product created",
      product,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
