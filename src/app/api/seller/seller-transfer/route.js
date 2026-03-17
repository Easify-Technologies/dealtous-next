import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { transporter } from "@/lib/mailer";

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    const escrow = await prisma.escrowOrder.update({
      where: {
        id: orderId
      },
      data: {
        status: "SELLER_TRANSFER_PENDING"
      }
    });

    const product = await prisma.product.findUnique({
      where: {
        id: escrow.productId
      },
      select: {
        name: true
      }
    });

    const html = `
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);"> <!-- Header --> <tr> <td style="background:#f59e0b; color:#ffffff; padding:20px; text-align:center;"> <h2 style="margin:0;">⏳ Transfer Marked as Pending</h2> </td> </tr> <!-- Body --> <tr> <td style="padding:30px;"> <p style="font-size:16px; color:#333;"> Hi <strong></strong>, </p> <p style="font-size:15px; color:#555; line-height:1.6;"> You have successfully marked the product transfer as <strong>Pending</strong> for the following order: </p> <!-- Order Details --> <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"> <tr> <td style="padding:12px; background:#f9fafb; border-radius:6px;"> <strong>Order ID:</strong> ${escrow.id} <br/> <strong>Product:</strong> ${product.name} <br/> <strong>Status:</strong> SELLER_TRANSFER_PENDING </td> </tr> </table> <p style="font-size:15px; color:#555; line-height:1.6;"> This means the transfer process has been initiated from your side. Please ensure that all necessary steps are completed promptly so the buyer can confirm receipt. </p> <!-- CTA --> <div style="text-align:center; margin:30px 0;"> <a href=${`${process.env.NEXTAUTH_URL}/user/orders`} style="background:#f59e0b; color:#fff; text-decoration:none; padding:12px 20px; border-radius:6px; display:inline-block; font-weight:bold;"> View Order Details </a> </div> <!-- Info Box --> <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"> <tr> <td style="padding:10px; background:#fff7ed; border-radius:6px; color:#9a3412;"> ⚠️ Make sure to complete the transfer as soon as possible to avoid delays in payment release. </td> </tr> </table> <p style="font-size:14px; color:#777;"> If you have any questions or face any issues during the transfer, feel free to contact our support team. </p> <p style="font-size:14px; color:#333;"> Best regards,<br/> <strong>Dealtous</strong> </p> </td> </tr> <!-- Footer --> <tr> <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#999;"> © 2026 The Dealtous. All rights reserved. </td> </tr> </table> </td> </tr>
    `;

    await transporter.sendMail({
      from: `"Dealtous" <${process.env.SMTP_USER}>`,
      to: seller?.email,
      subject: "Product Transfer Marked as Pending",
      html,
    });

    return NextResponse.json({ escrow, message: "Seller marked the product" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
