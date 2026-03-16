"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useFetchProductById } from "@/queries/single-product";
import Preloader from "@/helper/Preloader";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

function CheckoutForm({ product, productId, buyerId }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async () => {
    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card element not found.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // 1️⃣ Create PaymentIntent
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          buyerId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      console.log("Client Secret:", data.clientSecret);

      // 2️⃣ Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      console.log("Stripe result:", result);

      if (result.error) {
        setErrorMessage(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "requires_capture") {
        alert("Payment authorized successfully");
        setTimeout(() => {
          router.push("/all-product");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="cart padding-y-120">
        <div className="container">
          <div className="cart-content">
            <div className="table-responsive">
              <table className="table style-two">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <div className="cart-item">
                        <div className="d-flex align-items-center gap-3">
                          <div className="cart-item__thumb">
                            <img
                              src={product?.images[0]}
                              alt={product?.name}
                              className="cover-img"
                            />
                          </div>

                          <div className="cart-item__content">
                            <h6 className="cart-item__title font-heading fw-700 text-capitalize font-18 mb-4">
                              {product?.name}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>${product?.price}</td>
                    <td>${product?.price}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Stripe Card Input */}
            <div className="mt-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                    },
                  },
                }}
              />
            </div>

            <div className="cart-content__bottom flx-between gap-2 mt-4">
              <Link
                href="/all-product"
                className="btn btn-outline-light flx-align gap-2 pill btn-lg"
              >
                Continue Shopping
              </Link>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn btn-main flx-align gap-2 pill btn-lg"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>

            {errorMessage && (
              <div className="alert alert-danger text-center mt-3">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Checkout() {
  const params = useSearchParams();

  const productId = params.get("productId") ?? "";
  const buyerId = params.get("userId") ?? "";

  const { data: product, isPending } = useFetchProductById(productId);

  if (isPending) return <Preloader />;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm product={product} productId={productId} buyerId={buyerId} />
    </Elements>
  );
}
