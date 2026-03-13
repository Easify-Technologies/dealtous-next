import Link from "next/link";
import React from "react";

const CheckoutCancel = () => {
  return (
    <>
      <section style={{ height: "100vh" }} className="cart-thank section-bg padding-y-120 position-relative z-index-1 overflow-hidden">
        <img
          src="../assets/images/gradients/thank-you-gradient.png"
          alt=""
          className="bg--gradient"
        />
        <div className="container container-two">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
              <div className="cart-thank__content text-center">
                <h2 className="cart-thank__title mb-24">
                  Payment Not Completed
                </h2>
                <p className="">
                  Your payment was either cancelled or could not be processed.
                </p>
                <p className="">
                  Please try again or choose a different payment method to
                  complete your purchase.
                </p>
                <Link href="/all-product" className="btn btn-main btn-lg mt-4">
                  Return to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutCancel;
