import BrandSectionOne from "@/components/BrandSectionOne";
import BreadcrumbFive from "@/components/BreadcrumbFive";
import CartPersonal from "@/components/CartPersonal";
import FooterOne from "@/components/FooterOne";
import HeaderOne from "@/components/HeaderOne";
import Preloader from "@/helper/Preloader";

export const metadata = {
  title: "Cart Personal | Dealtous",
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


      {/* BreadcrumbFive */}
      <BreadcrumbFive />

      {/* CartPersonal */}
      <CartPersonal />

      {/* FooterOne */}
      <FooterOne />
    </>
  );
};

export default page;
