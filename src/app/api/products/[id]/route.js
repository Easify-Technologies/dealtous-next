export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Data, {
          folder: "vendor_products",
        });

        return uploadResponse.secure_url;
      })
    );

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
        price: Number(price),
        images: imageUrls,
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