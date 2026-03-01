import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {

  try {

    const user = verifyUser(request);

    const { id } = params;

    const body = await request.json();

    const product = await prisma.product.update({
      where: {
        id,
        vendorId: user.userId,
      },
      data: {
        ...body,
        status: "DRAFT", // reset status after edit
      },
    });

    return NextResponse.json(product);

  } catch (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );

  }

}

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
