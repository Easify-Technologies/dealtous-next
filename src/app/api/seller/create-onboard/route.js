import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { transporter } from "@/lib/mailer";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("seller_id");

    if (!email) {
      return NextResponse.json(
        { error: "Seller email is required" },
        { status: 400 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: { email }
    });

    if (!seller) {
      return NextResponse.json({
        seller: null,
        account: null
      });
    }

    let account = null;

    if (seller.stripeAccountId) {
      account = await stripe.accounts.retrieve(seller.stripeAccountId);
    }

    return NextResponse.json(
      { seller, account },
      { status: 200 }
    );

  } catch (error) {
    console.error("Onboarding fetch error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // 1️⃣ Create Stripe Express account
    const account = await stripe.accounts.create({
      type: "express",
      email,
    });

    // 2️⃣ Save in MongoDB
    const seller = await prisma.seller.create({
      data: {
        name,
        email,
        stripeAccountId: account.id,
        onboardingComplete: false,
      },
    });

    // 3️⃣ Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXTAUTH_URL}/seller/reauth`,
      return_url: `${process.env.NEXTAUTH_URL}/user/settings?onboarding=complete`,
      type: "account_onboarding",
    });

    const html = `
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);"> 
      <tr> <td style="background:#4f46e5; color:#ffffff; padding:20px; text-align:center;"> <h2 style="margin:0;">🎉 Seller Onboarding Complete</h2> </td> </tr> <tr> <td style="padding:30px;"> <p style="font-size:16px; color:#333;"> Hi <strong>${seller.name}</strong>, </p> <p style="font-size:15px; color:#555; line-height:1.6;"> We're excited to inform you that your <strong>seller account onboarding process has been successfully completed</strong>. </p> <p style="font-size:15px; color:#555; line-height:1.6;"> Your account is now fully verified, and you can start listing your products and receiving payments securely. </p> <!-- Highlights --> <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"> <tr> <td style="padding:10px; background:#f9fafb; border-radius:6px;"> ✅ Payments Enabled <br/> ✅ Payouts Activated <br/> ✅ Seller Dashboard Access Granted </td> </tr> </table> <!-- CTA --> <div style="text-align:center; margin:30px 0;"> <a href=${`${process.env.NEXTAUTH_URL}/user/settings`} style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 20px; border-radius:6px; display:inline-block; font-weight:bold;"> Go to Dashboard </a> </div> <p style="font-size:14px; color:#777;"> If you have any questions or need assistance, feel free to reach out to our support team. </p> <p style="font-size:14px; color:#333;"> Best regards,<br/> <strong>The Dealtous Team</strong> </p> </td> </tr> <!-- Footer --> <tr> <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#999;"> © 2026 Dealtous. All rights reserved. </td> </tr> </table> </td> </tr>
    `;

    await transporter.sendMail({
      from: `"Dealtous" <${process.env.SMTP_USER}>`,
      to: seller?.email,
      subject: "Your Seller Account is Now Fully Activated!",
      html,
    });

    return NextResponse.json({
      sellerId: seller.id,
      accountId: account.id,
      url: accountLink.url
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}