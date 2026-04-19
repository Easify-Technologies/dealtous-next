import { Suspense } from "react";
import Preloader from "@/helper/Preloader";
import UpdateBlog from "@/components/UpdateBlog";

export const metadata = {
  title: "Update Blog | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

const page = () => {
  return (
    <>
      <Preloader />

      <Suspense fallback={<Preloader />}>
        <UpdateBlog />
      </Suspense>
    </>
  );
};

export default page;
