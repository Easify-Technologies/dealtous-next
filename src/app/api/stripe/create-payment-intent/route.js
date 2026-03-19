import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { transporter } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { productId, buyerId } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
      select: {
        name: true,
        email: true
      }
    });

    const seller = await prisma.user.findUnique({
      where: { id: product.vendorId },
      select: {
        name: true,
        email: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const order = await prisma.escrowOrder.create({
      data: {
        productId,
        buyerId,
        sellerId: product.vendorId,
        amount: product.price,
        status: "PENDING"
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100),
      currency: "czk",
      capture_method: "manual",
      metadata: {
        orderId: order.id
      }
    });

    await prisma.escrowOrder.update({
      where: { id: order.id },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        status: "PAYMENT_AUTHORIZED"
      }
    });

    const buyerHtml = `
      <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; background:#ffffff; border-radius:10px; overflow:hidden;">

        <!-- Header -->
        <div style="background:#f59e0b; color:#ffffff; padding:20px; text-align:center;">
          <h2 style="margin:0;">🛒 Order Placed Successfully</h2>
        </div>

        <!-- Body -->
        <div style="padding:30px;">
          <p style="font-size:16px; color:#333;">
            Hi <strong>${buyer.name}</strong>,
          </p>

          <p style="font-size:15px; color:#555; line-height:1.6;">
            Your order has been successfully placed, and your payment has been authorized.
          </p>

          <p style="font-size:15px; color:#555; line-height:1.6;">
            <strong>Product:</strong> ${product.name} <br/>
            <strong>Order ID:</strong> ${order.id} <br/>
            <strong>Amount:</strong> $${product.price}
          </p>

          <!-- Status -->
          <div style="margin:20px 0; padding:15px; background:#fffbeb; border-radius:6px; font-size:14px; color:#92400e;">
            🔒 Payment Status: Authorized (held securely) <br/>
            ⏳ Awaiting seller to initiate transfer
          </div>

          <p style="font-size:15px; color:#555; line-height:1.6;">
            Your payment is securely held in escrow and will only be released after you confirm the product.
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:25px 0;">
            <a href="${process.env.NEXTAUTH_URL}/user/orders"
              style="background:#f59e0b; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;">
              View Your Order
            </a>
          </div>

          <p style="font-size:14px; color:#777;">
            You will be notified once the seller initiates the transfer.
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
          <h2 style="margin:0;">📦 New Order Received</h2>
        </div>

        <!-- Body -->
        <div style="padding:30px;">
          <p style="font-size:16px; color:#333;">
            Hi <strong>${seller.name}</strong>,
          </p>

          <p style="font-size:15px; color:#555; line-height:1.6;">
            You have received a new order for your product.
          </p>

          <p style="font-size:15px; color:#555; line-height:1.6;">
            <strong>Product:</strong> ${product.name} <br/>
            <strong>Order ID:</strong> ${order.id} <br/>
            <strong>Amount:</strong> $${product.price}
          </p>

          <!-- Status -->
          <div style="margin:20px 0; padding:15px; background:#eff6ff; border-radius:6px; font-size:14px; color:#1e3a8a;">
            💳 Payment Status: Authorized <br/>
            ⚡ Action Required: Initiate product transfer to the buyer
          </div>

          <p style="font-size:15px; color:#555; line-height:1.6;">
            The buyer’s payment is securely held in escrow. Please proceed with the product transfer to move forward.
          </p>

          <!-- CTA -->
          <div style="text-align:center; margin:25px 0;">
            <a href="${process.env.NEXTAUTH_URL}/user/orders"
              style="background:#2563eb; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;">
              Manage Order
            </a>
          </div>

          <p style="font-size:14px; color:#777;">
            Once the buyer confirms, the payment will be processed.
          </p>

          <p style="font-size:14px; color:#333;">
            Regards,<br/>
            <strong>Dealtous</strong>
          </p>
        </div>

      </div>
    `;

    await Promise.all([
      transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: buyer.email,
        subject: "Order Placed – Payment Authorized 🛒",
        html: buyerHtml,
      }),

      transporter.sendMail({
        from: `"Dealtous" <${process.env.SMTP_USER}>`,
        to: seller.email,
        subject: "New Order Received 📦",
        html: sellerHtml,
      })
    ]);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}