"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { useFetchProductById } from "@/queries/single-product";
import Preloader from "@/helper/Preloader";

const CheckoutSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const params = useSearchParams();

  const productId = params.get("productId") ?? "";
  const buyerId = params.get("buyerId") ?? "";

  const { data: product, isPending } = useFetchProductById(productId);

  // useEffect(() => {
  //   const startEscrow = async () => {
  //     try {
  //       const res = await axios.post(
  //         "/api/stripe/create-payment-intent",
  //         { productId, buyerId },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );

  //       if (res.data?.orderId) {
  //         setSuccess(true);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       setError(
  //         error.response?.data?.error || "Payment intent status not generated",
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (productId && buyerId) {
  //     startEscrow();
  //   }
  // }, [productId, buyerId]);

  if (loading || isPending) return <Preloader />;

  return (
    <>
      <section className="cart-thank section-bg padding-y-120 position-relative z-index-1 overflow-hidden">
        <img
          src="../assets/images/gradients/thank-you-gradient.png"
          alt=""
          className="bg--gradient"
        />
        <div className="container container-two">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
              <div className="cart-thank__content text-center">
                <h2 className="cart-thank__title mb-48">
                  Thank you for purchasing this products!!
                </h2>
                <div className="cart-thank__img">
                  <img
                    src={product?.images[0]}
                    alt={product?.name}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="padding-t-120">
            <div className="cart-thank__box">
              <div className="row gy-4">
                <div className="col-lg-12">
                  <div className="thank-card">
                    <h5 className="thank-card__title mb-3">
                      Product you have purchased
                    </h5>
                    <ul className="list-text">
                      <li className="list-text__item flx-align flex-nowrap">
                        <span className="text text-heading fw-500 font-heading fw-700 font-18">
                          Name
                        </span>
                        <span className="text text-heading fw-500">Price</span>
                      </li>
                      <li className="list-text__item flx-align flex-nowrap">
                        <span className="text text-heading fw-500">
                          {product?.name}
                        </span>
                        <span className="text">${product?.price}</span>
                      </li>
                    </ul>
                    <div className="flx-between gap-2 mt-4">
                      <Link
                        scroll={false}
                        href="/all-product"
                        className="btn btn-main flx-align gap-2 pill"
                      >
                        Back To Products
                        <span className="icon line-height-1 font-20">
                          <i className="las la-arrow-right" />
                        </span>
                      </Link>
                    </div>
                    {error && (
                      <div className="alert alert-danger text-center mt-4">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="alert alert-success text-center mt-4">
                        Escrow Order Created and Payment Authorized!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutSuccess;
