import { stripe } from "@/lib/stripe";

export async function POST(req) {

  const account = await stripe.accounts.create({
    type: "express",
  });

  return Response.json({ accountId: account.id });
}