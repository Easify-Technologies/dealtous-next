import Preloader from "@/helper/Preloader";
import DashboardUsers from "@/components/DashboardUsers";
import MasterLayout from "@/layout/MasterLayout";

export const metadata = {
  title: "All Users - Admin | Dealtous",
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

        <DashboardUsers />
      </MasterLayout>
    </>
  );
};

export default page;
