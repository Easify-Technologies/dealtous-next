import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
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
      refresh_url: "http://localhost:3000/seller/reauth",
      return_url: "http://localhost:3000/seller/dashboard",
      type: "account_onboarding",
    });

    return Response.json({
      sellerId: seller.id,
      accountId: account.id,
      url: accountLink.url
    });

  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}