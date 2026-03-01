import Progress from "../../../components/Progress";
import AdminCategories from "../../../components/AdminCategories";
import MasterLayout from "../../../layout/MasterLayout";

export const metadata = {
  title: "All Categories - Admin | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

import React from "react";

const page = () => {
  return (
    <>
      <MasterLayout>
        <Progress />

        <AdminCategories />
      </MasterLayout>
    </>
  );
};

export default page;
