import { Suspense } from "react";
import BlogDetails from "@/components/BlogDetails";
import FooterOne from "@/components/FooterOne";
import HeaderOne from "@/components/HeaderOne";
import Preloader from "@/helper/Preloader";

export const metadata = {
  title: "Blog Details | Dealtous",
  description: "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "assets/images/icons/cropped-DEALTOUS-1.png"
  }
};

const page = () => {
  return (
    <>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />


      {/* BlogDetails */}
      <Suspense fallback={<Preloader />}>
        <BlogDetails />
      </Suspense>

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default page;
