import React from "react";

import Preloader from "@/helper/Preloader";
import CheckoutCancel from "@/components/CheckoutCancel";

import { Suspense } from "react";

export const metadata = {
  title: "Payment Cancelled | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

const page = () => {
  return (
    <>
      <Preloader />

      {/* Checkout */}
      <Suspense fallback={<Preloader />}>
        <CheckoutCancel />
      </Suspense>
    </>
  );
};

export default page;
