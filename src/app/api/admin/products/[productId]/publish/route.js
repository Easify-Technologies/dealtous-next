import prisma from "../../../../../../lib/prisma.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {

  try {

    // Get token from header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET
    );

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const productId = params.productId;

    // Publish product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        status: "PUBLISHED",
        approvedBy: decoded.adminId,
        approvedAt: new Date()
      }
    });

    return NextResponse.json({
      message: "Product published successfully",
      product
    });

  } catch (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}
