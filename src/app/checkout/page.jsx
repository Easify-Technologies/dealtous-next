import React from "react";

import BreadcrumbFour from "@/components/BreadcrumbFour";
import FooterOne from "@/components/FooterOne";
import HeaderOne from "@/components/HeaderOne";
import Preloader from "@/helper/Preloader";
import Checkout from "@/components/Checkout";

import { Suspense } from "react";

export const metadata = {
  title: "Checkout | Dealtous",
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

      {/* HeaderOne */}
      <HeaderOne />

      {/* BreadcrumbSeven */}
      <BreadcrumbFour />

      {/* Checkout */}
      <Suspense fallback={<Preloader />}>
        <Checkout />
      </Suspense>

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default page;
