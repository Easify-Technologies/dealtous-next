import { Suspense } from "react";
import Settings from "@/components/Settings";
import Preloader from "@/helper/Preloader";

export const metadata = {
  title: "Settings - User | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

const page = () => {
  return (
    <>
      <Suspense fallback={<Preloader />}>
        <Settings />
      </Suspense>
    </>
  )
}

export default page