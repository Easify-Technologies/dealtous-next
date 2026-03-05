import Progress from "@/helper/Preloader";
import AdminLogin from "@/components/AdminLogin";

export const metadata = {
  title: "Login - Admin | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

const page = () => {
  return (
    <>
      <Progress />

      <AdminLogin />
    </>
  );
};

export default page;
