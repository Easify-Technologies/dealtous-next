import UserLayoutClient from "./UserLayoutClient";

export const metadata = {
  title: "User Dashboard | Dealtous",
  icons: {
    icon: "../assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

export default function Layout({ children }) {
  return <UserLayoutClient>{children}</UserLayoutClient>;
}
