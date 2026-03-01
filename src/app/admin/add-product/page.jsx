import AddProduct from "../../../components/AddProduct";
import Progress from "../../../components/Progress";
import MasterLayout from "../../../layout/MasterLayout";

export const metadata = {
  title: "Add Product - Admin | Dealtous",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png",
  }
};

const page = () => {
  return (
    <>
      <MasterLayout>
        <Progress />

        <AddProduct />
      </MasterLayout>
    </>
  );
};

export default page;
