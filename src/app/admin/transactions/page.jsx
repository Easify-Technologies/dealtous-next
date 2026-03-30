import Preloader from "@/helper/Preloader";
import Transactions from "@/components/Transactions";
import MasterLayout from "@/layout/MasterLayout";

export const metadata = {
  title: "Transactions - Admin | Dealtous",
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

        <Transactions />
      </MasterLayout>
    </>
  );
};

export default page;
