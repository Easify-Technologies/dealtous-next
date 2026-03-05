import { Suspense } from "react";

import Progress from "@/components/Progress";
import UpdateCategory from "@/components/UpdateCategory";
import Preloader from "@/helper/Preloader";

export const metadata = {
  title: "Update Category - Admin | Dealtous",
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

      <Suspense fallback={<Preloader />}>
        <UpdateCategory />
      </Suspense>
    </>
  );
};

export default page;
