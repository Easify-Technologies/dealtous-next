import MasterLayout from "@/layout/MasterLayout";
import Preloader from "@/helper/Preloader";
import AdminSales from "@/components/AdminSales";

export const metadata = {
  title: "Sales - Admin | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

const page = () => {
  return (
    <>
      <MasterLayout>
        <Preloader />

        <AdminSales />
      </MasterLayout>
    </>
  );
};

export default page;
