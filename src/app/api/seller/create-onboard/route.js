import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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