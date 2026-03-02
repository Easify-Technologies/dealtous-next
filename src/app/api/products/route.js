import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import fs from "fs";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const summary = formData.get("summary");
    const price = formData.get("price");
    const currency = formData.get("currency");
    const category = formData.get("category");
    const files = formData.getAll("images");

    if (!name || !price || files.length === 0) {
      return NextResponse.json(
        { error: "Name, price, and images required" },
        { status: 400 }
      );
    }

    const imagePaths = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filePath = `./public/uploads/${Date.now()}-${file.name}`;

      await fs.promises.writeFile(filePath, buffer);

      imagePaths.push(filePath.replace("./public", ""));
    }

    const product = await prisma.product.create({
      data: {
        name,
        summary,
        currency,
        category,
        price: Number(price),
        images: imagePaths,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
