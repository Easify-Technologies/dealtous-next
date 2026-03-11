import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      email: "seller_test@dealtous.com", // any test email
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3000/seller/reauth",
      return_url: "http://localhost:3000/seller/dashboard",
      type: "account_onboarding",
    });

    return Response.json({
      accountId: account.id,
      url: accountLink.url
    });

  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}