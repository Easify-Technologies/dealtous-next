import ArrivalOne from "../components/ArrivalOne";
import BannerOne from "../components/BannerOne";
import BlogOne from "../components/BlogOne";
import FeaturedAuthor from "../components/FeaturedAuthor";
import FeaturedOne from "../components/FeaturedOne";
import FooterOne from "../components/FooterOne";
import HeaderOne from "../components/HeaderOne";
import SellingOne from "../components/SellingOne";
import Preloader from "../helper/Preloader";

export const metadata = {
  title: "Home | Dealtous",
  description: "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "assets/images/icons/cropped-DEALTOUS-1.png"
  }
};

const page = () => {
  return (
    <section className="change-gradient">
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />

      {/* ArrivalOne */}
      <ArrivalOne />

      {/* FeaturedOne */}
      <FeaturedOne />

      {/* FeaturedAuthor */}
      <FeaturedAuthor />

      {/* SellingOne */}
      <SellingOne />

      {/* BlogOne */}
      <BlogOne />

      {/* FooterOne */}
      <FooterOne />
    </section>
  );
};

export default page;
