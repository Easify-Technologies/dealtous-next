import AllProduct from "@/components/AllProduct";
import Breadcrumb from "@/components/Breadcrumb";
import FooterOne from "@/components/FooterOne";
import HeaderOne from "@/components/HeaderOne";
import Preloader from "@/helper/Preloader";

export const metadata = {
  title: "All Products | Dealtous",
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

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* AllProduct */}
      <AllProduct />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default page;
