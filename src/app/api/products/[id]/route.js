export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

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
    const formData = await request.formData();
    const productId = params.id;

    const updateData = {};

    const fields = [
      "name",
      "summary",
      "price",
      "currency",
      "category",
      "subscribers",
      "engagementRate",
      "language",
      "postingFrequency",
      "monetizationMethods",
      "averageViews",
    ];

    for (const field of fields) {
      if (field === "monetizationMethods") {
        const values = formData.getAll("monetizationMethods");

        if (values && values.length > 0) {
          updateData.monetizationMethods = values;
        }

        continue;
      }

      const value = formData.get(field);

      if (value !== null && value !== "") {
        updateData[field] =
          field === "price" ? Number(value) : value;
      }
    }

    const files = formData.getAll("images");

    let imageUrls = [];

    if (files && files.length > 0 && files[0].size > 0) {
      imageUrls = await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());

          const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

          const uploadResponse = await cloudinary.uploader.upload(base64Data, {
            folder: "vendor_products",
          });

          return uploadResponse.secure_url;
        })
      );

      updateData.images = imageUrls;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updateData,
        status: "DRAFT"
      },
    });

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Product cannot be updated" },
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