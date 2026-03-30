"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getNames, getCode } from "country-list";

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
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [txHash, setTxHash] = useState("");
  const [cryptoLoading, setCryptoLoading] = useState(false);

  const countries = getNames().map((name) => ({
    name,
    code: getCode(name),
  }));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!stripe || !elements) {
      setErrorMessage("Stripe not loaded");
      return;
    }

    if (!formData.country) {
      setErrorMessage("Please select your country");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, buyerId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "requires_capture") {
        alert("Payment authorized!");
        router.push("/user/orders");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  const handleCryptoPayment = async () => {
    if (!txHash) {
      setErrorMessage("Enter transaction hash");
      return;
    }

    if(!formData.name || !formData.email || !formData.address ||
      !formData.city || !formData.postalCode || !formData.country
    ) {
      setErrorMessage("Please fill in all billing details");
      return;
    }

    setCryptoLoading(true);
    setErrorMessage("");

    try {
      // 1️⃣ Create Order
      const orderRes = await fetch("/api/orders/crypto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          paymentMethod: "CRYPTO",
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setErrorMessage(orderData.error);
        return;
      }

      // 2️⃣ Submit TX
      const res = await fetch("/api/crypto/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          txHash,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error);
        return;
      }

      alert("✅ Payment submitted! Waiting for admin verification.");

      setTimeout(() => {
        router.push("/user/orders");
      }, 1500);
    } catch (err) {
      setErrorMessage("Crypto payment failed");
    }

    setCryptoLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* LEFT - FORM */}
        <div className="col-md-7">
          <h4 className="mb-3">Billing Details</h4>

          <input
            name="name"
            placeholder="Full Name"
            className="form-control mb-3"
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email Address"
            className="form-control mb-3"
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            className="form-control mb-3"
            onChange={handleChange}
          />
          <select
            name="country"
            className="form-control mb-3"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Country
            </option>

            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>

          <div className="row">
            <div className="col">
              <input
                name="city"
                placeholder="City"
                className="form-control mb-3"
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                name="postalCode"
                placeholder="Postal Code"
                className="form-control mb-3"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Card */}
          <div className="p-3 border rounded">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="col-md-5 mt-3">
          <div className="border rounded p-3">
            <h5>Order Summary</h5>

            <div className="d-flex align-items-center gap-3 mt-3">
              <img src={product?.images[0]} width={60} />
              <div>
                <p className="mb-0">{product?.name}</p>
                <small>${product?.price}</small>
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <span>Total</span>
              <strong>${product?.price}</strong>
            </div>

            {/* Stripe Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary w-100 mt-3"
            >
              {loading ? "Processing..." : "Pay with Card"}
            </button>

            {/* OR Divider */}
            <div className="text-center my-3">OR</div>

            {/* Crypto Section */}
            <div className="border rounded p-3 bg-light">
              <h6 className="mb-2">Pay with Crypto</h6>

              <input
                type="text"
                placeholder="Enter Transaction Hash"
                className="form-control mb-2"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />

              <button
                onClick={handleCryptoPayment}
                disabled={cryptoLoading}
                className="btn btn-dark w-100"
              >
                {cryptoLoading ? "Submitting..." : "Submit Crypto Payment"}
              </button>
            </div>

            {errorMessage && (
              <div className="alert alert-danger mt-3">{errorMessage}</div>
            )}
          </div>
        </div>
      </div>
    </div>
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
