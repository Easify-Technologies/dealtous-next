import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { productId, buyerId } = await request.json();

    if (!productId || !buyerId) {
      return NextResponse.json(
        { error: "Missing productId or buyerId" },
        { status: 400 }
      );
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Product not available" },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${request.headers.get(
        "origin"
      )}/checkout/success?productId=${product.id}&buyerId=${buyerId}`,

      cancel_url: `${request.headers.get("origin")}/checkout/cancel`,

      metadata: {
        productId,
        buyerId,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
