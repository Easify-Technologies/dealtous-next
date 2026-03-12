"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { useFetchProductById } from "@/queries/single-product";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const Checkout = () => {
  const params = useSearchParams();

  const productId = params.get("productId") ?? "";
  const buyerId = params.get("userId") ?? "";

  const { data: product, isPending } = useFetchProductById(productId);

  const handleCheckout = async () => {
    const res = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        buyerId,
      }),
    });

    const data = await res.json();

    const stripe = await stripePromise;

    await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: { token: "tok_visa" },
      },
    });

    alert("Payment authorized and held in escrow");
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
                            <Link
                              scroll={false}
                              href="#"
                              className="link"
                            >
                              <img
                                src={product?.images[0]}
                                alt={product?.name}
                                className="cover-img"
                              />
                            </Link>
                          </div>
                          <div className="cart-item__content">
                            <h6 className="cart-item__title font-heading fw-700 text-capitalize font-18 mb-4">
                              {" "}
                              <Link
                                scroll={false}
                                href="#"
                                className="link"
                              >
                                {product?.name}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cart-item__totalPrice text-body font-18 fw-400 mb-0">
                        ${product?.price}
                      </span>
                    </td>
                    <td>
                      <span className="cart-item__totalPrice text-body font-18 fw-400 mb-0">
                        ${product?.price}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="cart-content__bottom flx-between gap-2">
              <Link
                scroll={false}
                href="/all-product"
                className="btn btn-outline-light flx-align gap-2 pill btn-lg"
              >
                <span className="icon line-height-1 font-20">
                  <i className="las la-arrow-left" />
                </span>
                Continue Shopping
              </Link>
              <button
                onClick={handleCheckout}
                className="btn btn-main flx-align gap-2 pill btn-lg"
              >
                Buy
                <span className="icon line-height-1 font-20">
                  <i className="las la-arrow-right" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
