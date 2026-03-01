import Progress from "../../../components/Progress";
import AddCategory from "../../../components/AddCategory";
import MasterLayout from "../../../layout/MasterLayout";

export const metadata = {
  title: "Add Category - Admin | Dealtous",
  description: "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png"
  }
};

const page = () => {
  return (
    <>
      <MasterLayout>

        <Progress />

        <AddCategory />

      </MasterLayout>
    </>
  )
}

export default page