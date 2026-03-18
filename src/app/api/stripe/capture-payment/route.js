import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { transporter } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId }
    });

    const product = await prisma.product.findUnique({
      where: { id: order.productId },
      select: {
        name: true
      }
    });

    const buyer = await prisma.user.findUnique({
      where: {
        id: order.buyerId
      },
      select: {
        name: true,
        email: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "BUYER_CONFIRMED") {
      return NextResponse.json({ error: "Buyer not confirmed" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );

    if (paymentIntent.status !== "requires_capture") {
      return NextResponse.json({
        error: `Cannot capture payment. Status: ${paymentIntent.status}`
      });
    }

    const captured = await stripe.paymentIntents.capture(
      order.stripePaymentIntentId
    );

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: {
        status: "RELEASE_READY",
        releaseAfter: new Date(Date.now() + 5 * 60 * 1000)
      }
    });

    const html = `
  <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#6366f1; color:#ffffff; padding:20px; text-align:center;">
      <h2 style="margin:0;">💳 Payment Captured Successfully</h2>
    </div>

    <!-- Body -->
    <div style="padding:30px;">
      <p style="font-size:16px; color:#333;">
        Hi <strong>${buyer.name}</strong>,
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        Your payment for the following order has been successfully captured by our team.
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        <strong>Product:</strong> ${product.name} <br/>
        <strong>Order ID:</strong> ${order.id}
      </p>

      <!-- Status Box -->
      <div style="margin:20px 0; padding:15px; background:#eef2ff; border-radius:6px; font-size:14px; color:#3730a3;">
        ✅ Payment Status: Captured <br/>
        ⏳ Next Step: Funds will be released to the seller shortly
      </div>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        Your transaction is now being processed securely. No further action is required from your side.
      </p>

      <!-- CTA -->
      <div style="text-align:center; margin:25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/user/orders"
           style="background:#6366f1; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;">
          View Order Details
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        If you have any questions or notice any issues, feel free to contact our support team.
      </p>

      <p style="font-size:14px; color:#333;">
        Thanks,<br/>
        <strong>Dealtous</strong>
      </p>
    </div>

  </div>
`;
    await transporter.sendMail({
      from: `"Dealtous" <${process.env.SMTP_USER}>`,
      to: buyer?.email,
      subject: "Payment captured successfully",
      html
    });

    return NextResponse.json({
      message: "Payment captured successfully",
      captured
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}