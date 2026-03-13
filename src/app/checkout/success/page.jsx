import React from "react";

import Preloader from "@/helper/Preloader";
import CheckoutSuccess from "@/components/CheckoutSuccess";

import { Suspense } from "react";

export const metadata = {
  title: "Payment Successful | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

const page = () => {
  return (
    <>
      <Preloader />

      {/* Checkout */}
      <Suspense fallback={<Preloader />}>
        <CheckoutSuccess />
      </Suspense>
    </>
  );
};

export default page;
