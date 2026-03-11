"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Checkout() {

  async function handleCheckout() {

    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "PRODUCT_ID",
        buyerId: "USER_ID"
      })
    });

    const data = await res.json();

    const stripe = await stripePromise;

    await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: { token: "tok_visa" }
      }
    });

    alert("Payment authorized and held in escrow");

  }

  return (
    <button onClick={handleCheckout}>
      Buy Now
    </button>
  );
}