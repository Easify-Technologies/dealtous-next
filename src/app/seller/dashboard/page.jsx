import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function SellerDashboard() {
  const seller = await prisma.seller.findFirst();

  let account = null;
  if (seller?.stripeAccountId) {
    account = await stripe.accounts.retrieve(seller.stripeAccountId);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Seller Dashboard</h1>
      <p>Name: {seller?.name}</p>
      <p>Email: {seller?.email}</p>
      <p>Stripe Account ID: {account?.id}</p>
      <p>Charges Enabled: {account?.charges_enabled ? "Yes" : "No"}</p>
      <p>Payouts Enabled: {account?.payouts_enabled ? "Yes" : "No"}</p>
    </div>
  );
}