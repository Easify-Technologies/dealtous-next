import { stripe } from "@/lib/stripe";

export async function GET() {
  try {

    const deleted = await stripe.accounts.del(
      "acct_1T9ODo4GH5OUIk8m"
    );

    return Response.json(deleted);

  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message });
  }
}