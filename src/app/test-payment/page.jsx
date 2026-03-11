"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm() {

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPaymentIntent() {

    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: "69a80291d539ed6c3c7d4f7f",
        buyerId: "69a9c4dcd2e99a6e02cf227c"
      })
    });

    const data = await res.json();

    setClientSecret(data.clientSecret);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });

    if (result.error) {
      alert(result.error.message);
    } else {

      if (result.paymentIntent.status === "requires_capture") {
        alert("Payment authorized. Escrow started.");
      }

      console.log(result.paymentIntent);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px" }}>

      <h2>Test Escrow Payment</h2>

      <button onClick={createPaymentIntent}>
        Create Payment
      </button>

      <form onSubmit={handleSubmit}>

        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <CardElement />
        </div>

        <button disabled={!stripe || loading}>
          Pay
        </button>

      </form>

    </div>
  );
}

export default function PaymentPage() {

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}