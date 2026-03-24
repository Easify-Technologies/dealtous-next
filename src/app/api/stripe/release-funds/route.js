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

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: order.sellerId }
    });

    if (!user) {
      return NextResponse.json({ error: "Seller user not found" }, { status: 404 });
    }

    const seller = await prisma.seller.findUnique({
      where: { email: user.email }
    });

    const buyer = await prisma.user.findUnique({
      where: { id: order.buyerId },
      select: {
        name: true,
        email: true
      }
    });

    const product = await prisma.product.findUnique({
      where: { id: order.productId },
      select: { name: true }
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    if (order.status !== "RELEASE_READY") {
      return NextResponse.json({ error: "Order not ready for payout" }, { status: 400 });
    }

    if (order.releaseAfter > new Date()) {
      return NextResponse.json({ error: "Escrow hold active" }, { status: 400 });
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round(order.amount * 100),
      currency: "czk",
      destination: seller.stripeAccountId
    });

    const buyerHtml = `
  <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#16a34a; color:#ffffff; padding:20px; text-align:center;">
      <h2 style="margin:0;">🎉 Purchase Completed</h2>
    </div>

    <!-- Body -->
    <div style="padding:30px;">
      <p style="font-size:16px; color:#333;">
        Hi <strong>${buyer.name}</strong>,
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        Your transaction has been successfully completed. The payment has been securely transferred to the seller.
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        <strong>Product:</strong> ${product.name} <br/>
        <strong>Order ID:</strong> ${order.id}
      </p>

      <!-- Status -->
      <div style="margin:20px 0; padding:15px; background:#ecfdf5; border-radius:6px; font-size:14px; color:#065f46;">
        ✅ Payment Transferred <br/>
        ✅ Order Completed <br/>
        🎯 You are now the official owner of this product
      </div>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        Thank you for trusting Dealtous for your purchase. We hope you have a great experience!
      </p>

      <!-- CTA -->
      <div style="text-align:center; margin:25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/user/orders"
           style="background:#16a34a; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;">
          View Your Orders
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        If you need any help, feel free to reach out to our support team.
      </p>

      <p style="font-size:14px; color:#333;">
        Thanks,<br/>
        <strong>Dealtous</strong>
      </p>
    </div>

  </div>
`;

    const sellerHtml = `
  <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#2563eb; color:#ffffff; padding:20px; text-align:center;">
      <h2 style="margin:0;">💰 Product Sold Successfully</h2>
    </div>

    <!-- Body -->
    <div style="padding:30px;">
      <p style="font-size:16px; color:#333;">
        Hi <strong>${seller.name}</strong>,
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        Great news! Your product has been successfully sold and the payment has been transferred to your account.
      </p>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        <strong>Product:</strong> ${product.name} <br/>
        <strong>Order ID:</strong> ${order.id}
      </p>

      <!-- Status -->
      <div style="margin:20px 0; padding:15px; background:#eff6ff; border-radius:6px; font-size:14px; color:#1e3a8a;">
        💸 Payment Status: Transferred <br/>
        📦 Product Status: Sold <br/>
        🎉 Funds should reflect in your connected account shortly
      </div>

      <p style="font-size:15px; color:#555; line-height:1.6;">
        You can check your Stripe account/dashboard for payout details.
      </p>

      <!-- CTA -->
      <div style="text-align:center; margin:25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/user/dashboard"
           style="background:#2563eb; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;">
          View Dashboard
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        Thank you for selling on Dealtous!
      </p>

      <p style="font-size:14px; color:#333;">
        Regards,<br/>
        <strong>Dealtous</strong>
      </p>
    </div>

  </div>
`;

    await prisma.escrowOrder.update({
      where: { id: orderId },
      data: {
        stripeTransferId: transfer.id,
        status: "RELEASED",
        payoutStatus: "PAID"
      }
    });

    await prisma.product.update({
      where: { id: product.id },
      data: {
        isSold: true
      }
    });

    await Promise.all([
      transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: buyer.email,
        subject: "Your Purchase is Complete 🎉",
        html: buyerHtml,
      }),

      transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: seller.email,
        subject: "Your Product Has Been Sold 💰",
        html: sellerHtml,
      })
    ]);

    return NextResponse.json({ transfer, message: "Release Transfer Fund Completed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}