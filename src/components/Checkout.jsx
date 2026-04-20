"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const CheckoutForm = ({ product, productId, buyerId }) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [activeTab] = useState("CRYPTO");

  const [loading, setLoading] = useState(false);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [txHash, setTxHash] = useState("");

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

  // ================= EXISTING HANDLERS (UNCHANGED) =================
  const handleCheckout = async () => {
    if (!stripe || !elements) {
      setErrorMessage("Stripe not loaded");
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.country
    ) {
      setErrorMessage("Please fill in all billing details");
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
              country: formData.country,
            },
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Payment Failed");
      } else if (
        result.paymentIntent?.status === "succeeded" ||
        result.paymentIntent?.status === "requires_capture"
      ) {
        router.push("/user/orders");
      } else {
        setErrorMessage("Payment not completed");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  const handleCryptoPayment = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.country
    ) {
      setErrorMessage("Please fill in all billing details");
      return;
    }

    if (!txHash) {
      setErrorMessage("Enter transaction hash");
      return;
    }

    setCryptoLoading(true);
    setErrorMessage("");

    try {
      const orderRes = await fetch("/api/orders/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      const res = await fetch("/api/crypto/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          productId,
          txHash,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error);
        return;
      }

      alert("✅ Payment submitted!");
      router.push("/user/orders");
    } catch {
      setErrorMessage("Crypto payment failed");
    }

    setCryptoLoading(false);
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="container py-5">
      <div className="row g-2">
        <div className="col-12">
          {/* 🔐 TRUST BLOCK */}
          <div className="mb-4 p-3 rounded bg-white shadow">
            <h5 className="fw-semibold mb-3">🔒 Secure Transaction</h5>

            <ul className="list-unstyled small mb-0">
              <li className="mb-2 d-flex align-items-center gap-2">
                <span className="text-success">✔</span>
                Payment is held securely in escrow
              </li>

              <li className="mb-2 d-flex align-items-center gap-2">
                <span className="text-success">✔</span>
                Channel ownership is transferred safely
              </li>

              <li className="d-flex align-items-center gap-2">
                <span className="text-success">✔</span>
                Funds released only after your confirmation
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12">
          {/* 📦 HOW IT WORKS */}
          <div className="mb-4 p-3 rounded bg-white shadow">
            <h5 className="fw-semibold mb-3">🛒 How the purchase works</h5>

            <div className="purchase-steps">
              <div className="step">
                <span>💳</span>
                <p>You complete the payment securely</p>
              </div>

              <div className="step">
                <span>🔄</span>
                <p>Seller transfers channel ownership</p>
              </div>

              <div className="step">
                <span>✅</span>
                <p>You confirm access</p>
              </div>

              <div className="step">
                <span>💰</span>
                <p>Funds are released to seller</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-lg-7">
          {/* Tabs */}
          {/* <div className="d-flex align-items-center justify-content-between mb-4 gap-3 rounded overflow-hidden">
            <button
              className={`flex-fill btn ${activeTab === "CARD" ? "btn-primary" : "btn-light"}`}
              onClick={() => setActiveTab("CARD")}
            >
              Pay with Card
            </button>
            <button
              className={`flex-fill btn ${activeTab === "CRYPTO" ? "btn-dark text-white" : "btn-light"}`}
              onClick={() => setActiveTab("CRYPTO")}
            >
              Pay with Crypto
            </button>
          </div> */}

          {/* Billing */}
          <div className="card bg-white border-0 p-4 shadow">
            <h5 className="mb-3">Billing Details</h5>

            <input
              name="name"
              placeholder="Full Name"
              className="form-control mb-3"
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
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
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="row">
              <div className="col-md-6">
                <input
                  name="city"
                  placeholder="City"
                  className="form-control mb-3"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  className="form-control mb-3"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CARD TAB */}
            {/* {activeTab === "CARD" && (
              <div className="border rounded p-3 mt-2">
                <CardElement
                  options={{
                    hidePostalCode: true,
                  }}
                />
              </div>
            )} */}

            {/* CRYPTO TAB */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="Crypto Transaction Hash"
                className="form-control mb-2"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
            </div>

            {/* ERROR */}
            {errorMessage && (
              <div className="alert alert-danger mt-3">{errorMessage}</div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={handleCryptoPayment}
              disabled={cryptoLoading}
              className="btn btn-dark w-100 mt-3"
            >
              {cryptoLoading ? "Submitting..." : "Submit Crypto Payment"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-5">
          <div className="card p-4 shadow border-0 summary-card">
            {/* Header */}
            <h5 className="fw-semibold mb-3">🧾 Order Summary</h5>

            {/* Product Info */}
            <div className="d-flex gap-4 align-items-start">
              <img
                src={product?.images?.[0] || "/placeholder.png"}
                alt={product?.name}
                className="rounded summary-img"
              />

              <div className="flex-grow-1">
                <p className="mb-1 fw-semibold fs-5">{product?.name}</p>

                {/* Metrics */}
                <div className="summary-meta small text-muted mt-2">
                  <div>
                    👥 {product?.subscribers?.toLocaleString() || "N/A"}{" "}
                    subscribers
                  </div>
                  <div>📈 {product?.engagementRate || "N/A"} engagement</div>
                  <div>📊 Avg views: {product?.averageViews || "N/A"}</div>
                  <div>
                    💰{" "}
                    {Array.isArray(product?.monetizationMethods)
                      ? product?.monetizationMethods.join(", ")
                      : product?.monetizationMethods || "Unknown"}
                  </div>
                  <div>🌍 Language: {product?.language}</div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-3" />

            {/* Pricing Breakdown */}
            <div className="d-flex justify-content-between mb-2 text-muted">
              <span>Channel Price</span>
              <span>
                {product?.currency === "USD"
                  ? `$${product?.price}`
                  : `INR ${product?.price}`}
              </span>
            </div>

            {/* Total */}
            <div className="d-flex justify-content-between align-items-center border-top pt-3">
              <span className="fw-semibold">Total</span>
              <h5 className="fw-bold text-success mb-0">
                {product?.currency === "USD"
                  ? `$${product?.price}`
                  : `INR ${product?.price}`}
              </h5>
            </div>

            {/* Trust micro-copy */}
            <p className="text-muted small mt-3 mb-0 text-center">
              🔒 Secure payment • Protected by escrow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
