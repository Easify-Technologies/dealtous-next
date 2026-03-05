import Register from "@/components/Register";
import Progress from "@/components/Progress";

export const metadata = {
  title: "Register | Dealtous",
  description: "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "assets/images/icons/cropped-DEALTOUS-1.png"
  }
};

const page = () => {
  return (
    <>
      {/* Progress */}
      <Progress />

      {/* Login */}
      <Register />
    </>
  );
};

export default page;
