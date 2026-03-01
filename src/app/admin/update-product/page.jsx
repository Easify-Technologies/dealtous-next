import Progress from "../../../components/Progress";
import UpdateProduct from "../../../components/UpdateProduct";

export const metadata = {
  title: "Update Product - Admin | Dealtous",
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

      <UpdateProduct />
    </>
  );
};

export default page;
