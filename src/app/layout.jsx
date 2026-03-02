import "./globals.scss";
import RouteScrollToTop from "../helper/RouteScrollToTop";
import { Raleway } from "next/font/google";

import SessionProviderWrapper from "../providers/SessionProviderWrapper";

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
          <RouteScrollToTop />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
