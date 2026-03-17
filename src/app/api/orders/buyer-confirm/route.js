import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { transporter } from "@/lib/mailer";

export async function POST(request) {
  try {
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
        name: true
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

    const html = `
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;"> <!-- Header --> <tr> <td style="background:#10b981; color:#ffffff; padding:20px; text-align:center;"> <h2 style="margin:0;">🚀 Transfer Initiated</h2> </td> </tr> <!-- Body --> <tr> <td style="padding:30px;"> <p style="font-size:16px; color:#333;"> Hi <strong>{{buyerName}}</strong>, </p> <p style="font-size:15px; color:#555; line-height:1.6;"> Good news! The seller has initiated the transfer for your purchase. </p> <p style="font-size:15px; color:#555; line-height:1.6;"> <strong>Product:</strong> ${product.name} <br/> <strong>Order ID:</strong> ${order.id} </p> <p style="font-size:15px; color:#555; line-height:1.6;"> Once you receive and verify the product, please confirm it from your dashboard so we can proceed with the payment release. </p> <!-- CTA --> <div style="text-align:center; margin:25px 0;"> <a href=${`${process.env.NEXTAUTH_URL}/user/settings`} style="background:#10b981; color:#fff; text-decoration:none; padding:10px 18px; border-radius:6px; display:inline-block;"> View Order </a> </div> <p style="font-size:14px; color:#777;"> If you face any issues, feel free to contact support. </p> <p style="font-size:14px; color:#333;"> Thanks,<br/> <strong>Dealtous</strong> </p> </td> </tr> </table> </td> </tr>
    `;

    await transporter.sendMail({
      from: `"Dealtous" <${process.env.SMTP_USER}>`,
      to: seller?.email,
      subject: "Your Product Transfer Has Been Initiated",
      html,
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
