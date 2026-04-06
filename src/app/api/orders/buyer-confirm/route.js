import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth";
import { transporter } from "@/lib/mailer";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    const buyerEmail = session.user.email ?? "";
    const buyerName = session.user.name ?? "";

    const body = await request.json();
    const orderId = typeof body.orderId === "object"
      ? body.orderId.orderId
      : body.orderId;

    const order = await prisma.escrowOrder.findUnique({
      where: { id: orderId }
    });

    const product = await prisma.product.findUnique({
      where: {
        id: order.productId
      },
      select: {
        name: true,
        vendor: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 400 });
    }

    if (order.status !== "SELLER_TRANSFER_PENDING") {
      return NextResponse.json(
        { error: "Seller transfer not completed" },
        { status: 400 }
      );
    }

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: { status: "BUYER_CONFIRMED" }
    });

    const buyerHtml = `
  <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#10b981; color:#ffffff; padding:20px; text-align:center;">
      <h2 style="margin:0;">✅ Purchase Confirmed</h2>
    </div>

    <!-- Body -->
    <div style="padding:30px;">
      <p style="font-size:16px; color:#333;">
        Hi <strong>${buyerName}</strong>,
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        Thank you for confirming the receipt of your product.
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        <strong>Product:</strong> ${product.name} <br/>
        <strong>Order ID:</strong> ${order.id}
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        We are now processing the next step, and the payment will be released to the seller shortly.
      </p>

      <!-- CTA -->
      <div style="text-align:center; margin:25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/user/orders"
           style="background:#10b981; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;">
          View Your Orders
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        If you have any concerns, please contact support immediately.
      </p>

      <p style="font-size:14px; color:#333;">
        Thanks,<br/>
        <strong>Dealtous</strong>
      </p>
    </div>

  </div>
`;

    const adminHtml = `
  <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#2563eb; color:#ffffff; padding:20px; text-align:center;">
      <h2 style="margin:0;">⚡ Payment Capture Required</h2>
    </div>

    <!-- Body -->
    <div style="padding:30px;">
      <p style="font-size:16px; color:#333;">
        Hello Admin,
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        The buyer has confirmed receipt of the product. The order is now ready for payment capture.
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        <strong>Product:</strong> ${product.name} <br/>
        <strong>Order ID:</strong> ${order.id}
      </p>

      <!-- Highlight -->
      <div style="margin:20px 0; padding:15px; background:#fef3c7; border-radius:6px; font-size:14px; color:#92400e;">
        ⚠️ Action Required: Capture the payment to release funds to the seller.
      </div>

      <!-- CTA -->
      <div style="text-align:center; margin:25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/admin/products"
           style="background:#2563eb; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;">
          Open Admin Dashboard
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        Ensure verification is complete before capturing payment.
      </p>

      <p style="font-size:14px; color:#333;">
        System Notification,<br/>
        <strong>Dealtous</strong>
      </p>
    </div>

  </div>
`;

    Promise.all([
      transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: buyerEmail,
        subject: "Purchase Confirmed Successfully",
        html: buyerHtml,
      }),

      transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "Action Required: Capture Payment",
        html: adminHtml,
      })
    ]).catch(err => {
      console.error("EMAIL ERROR:", err);
    });

    return NextResponse.json(
      { message: "Buyer Confirmed" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
