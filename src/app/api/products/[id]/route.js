import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import fs from "fs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth";

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function GET(request, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      }
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;
    const vendorId = session.user.id;
    const otp = generateOTP();

    const formData = await request.formData();

    const name = formData.get("name");
    const summary = formData.get("summary");
    const price = formData.get("price");
    const currency = formData.get("currency");
    const category = formData.get("category");
    const subscribers = formData.get("subscribers");
    const engagementRate = formData.get("engagementRate");
    const language = formData.get("language");
    const postingFrequency = formData.get("postingFrequency");
    const monetizationMethods = formData.get("monetizationMethods");
    const averageViews = formData.get("averageViews");
    const files = formData.getAll("images");

    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existing || existing.vendorId !== vendorId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const imagePaths = [];

    if (files.length > 0 && files[0].size > 0) {
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = `./public/uploads/${Date.now()}-${file.name}`;
        await fs.promises.writeFile(filePath, buffer);

        imagePaths.push(filePath.replace("./public", ""));
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        summary,
        currency,
        category,
        vendorId,
        subscribers,
        engagementRate,
        language,
        averageViews,
        monetizationMethods,
        postingFrequency,
        pincode: otp,
        price: Number(price),
        images: imagePaths,
      },
    });

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Products cannot be updated" },
      { status: 500 }
    );
  }
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