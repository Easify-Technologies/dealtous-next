import BrandSectionOne from "@/components/BrandSectionOne";
import BreadcrumbFour from "@/components/BreadcrumbFour";
import Cart from "@/components/Cart";
import FooterOne from "@/components/FooterOne";
import HeaderOne from "@/components/HeaderOne";
import Preloader from "@/helper/Preloader";

export const metadata = {
  title: "Cart | Dealtous",
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

      {/* BreadcrumbFour */}
      <BreadcrumbFour />

      {/* Cart */}
      <Cart />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default page;
