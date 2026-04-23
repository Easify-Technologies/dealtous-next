import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";
import { Raleway } from "next/font/google";
import { Toaster } from "react-hot-toast";
import RouteScrollToTop from "../helper/RouteScrollToTop";

import SessionProviderWrapper from "../providers/SessionProviderWrapper";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import BootstrapClient from "./BootstrapClient";

export const metadata = {
  title: "Dealtous - Buy & Sell Telegram Channels And Social Accounts",
  description:
    "Buy and sell Telegram channels and other social media accounts securely on Dealtous. Discover verified listings and reach your audience faster.",
  icons: {
    icon: "assets/images/icons/cropped-DEALTOUS-1.png",
  },
};

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={raleway.className} suppressHydrationWarning={true}>
        <SessionProviderWrapper>
          <BootstrapClient />
          <Toaster />
          <RouteScrollToTop />
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
