import React from "react";

import Preloader from "@/helper/Preloader";
import HeaderOne from "@/components/HeaderOne";
import FooterOne from "@/components/FooterOne";

export const metadata = {
  title: "Terms & Conditions | Dealtous",
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

      <HeaderOne />

      <section className="hero section-bg z-index-1">
        <img
          src="assets/images/gradients/banner-gradient.png"
          alt=""
          className="bg--gradient white-version"
        />
        <img
          src="assets/images/shapes/element-moon1.png"
          alt=""
          className="element one"
        />
        <img
          src="assets/images/shapes/element-moon2.png"
          alt=""
          className="element two"
        />

        <div className="container container-two">
          <div className="row gy-4">
            <div className="col-12">
              <div className="hero-inner position-relative pe-lg-5">
                <h1 className="hero-inner__title">Terms & Conditions</h1>

                <p className="text-muted mb-4">
                  <strong>Last updated:</strong> 31-01-2026
                </p>

                <p>
                  Welcome to <strong>Dealtous</strong> (“Platform”, “we”, “our”,
                  “us”). These Terms & Conditions (“Terms”) govern your access
                  to and use of the Dealtous application, website, and related
                  services.
                </p>

                <p>
                  Dealtous is an e-commerce marketplace that allows users to buy
                  and sell social media accounts and channels, including but not
                  limited to Telegram, Instagram, and other digital platforms.
                </p>

                <p>
                  By accessing or using Dealtous, you agree to be legally bound
                  by these Terms. If you do not agree, please do not use the
                  Platform.
                </p>

                <h2 className="mt-3">1. Company Information</h2>
                <p>
                  Dealtous is operated from <strong>Budapest, Hungary</strong>,
                  and is subject to applicable Hungarian and European Union
                  laws.
                </p>

                <h2 className="mt-3">2. Eligibility</h2>
                <ul>
                  <li>
                    You must be at least <strong>18 years old</strong>
                  </li>
                  <li>
                    You must have the legal capacity to enter into a binding
                    contract
                  </li>
                  <li>
                    You must comply with all applicable local and international
                    laws
                  </li>
                  <li>
                    You must not be prohibited from using online marketplaces
                  </li>
                </ul>

                <p>
                  By using the Platform, you confirm that you meet these
                  requirements.
                </p>

                <h2 className="mt-3">3. Account Registration</h2>
                <ul>
                  <li>Provide accurate, current, and complete information</li>
                  <li>
                    Maintain the confidentiality of your login credentials
                  </li>
                  <li>
                    You are responsible for all activities under your account
                  </li>
                  <li>
                    We may suspend or terminate accounts with false or
                    misleading information
                  </li>
                </ul>

                <h2 className="mt-3">4. Nature of the Platform</h2>
                <ul>
                  <li>Dealtous acts solely as a marketplace facilitator</li>
                  <li>
                    We do not own, sell, or transfer social media accounts
                  </li>
                  <li>
                    Transactions occur directly between buyers and sellers
                  </li>
                  <li>Dealtous is not a party to user transactions</li>
                </ul>

                <h2 className="mt-3">5. Buying & Selling Social Media Accounts</h2>

                <h3>Seller Responsibilities</h3>
                <ul>
                  <li>You are the legal owner of the account being sold</li>
                  <li>
                    The account is free from disputes or third-party claims
                  </li>
                  <li>The sale does not violate platform terms</li>
                  <li>All information provided is accurate</li>
                </ul>

                <h3 className="mt-3">Buyer Responsibilities</h3>
                <ul>
                  <li>
                    Account trading may violate third-party platform policies
                  </li>
                  <li>No guarantee of account longevity or recovery</li>
                  <li>All risks are borne by the buyer</li>
                </ul>

                <h2 className="mt-3">6. Prohibited Activities</h2>
                <ul>
                  <li>Selling hacked, stolen, or unauthorized accounts</li>
                  <li>Fraud, scams, or deceptive practices</li>
                  <li>Providing false or misleading information</li>
                  <li>Bypassing platform security or escrow systems</li>
                  <li>Illegal, harmful, or abusive behavior</li>
                </ul>

                <p>
                  Violations may result in immediate suspension or permanent
                  termination.
                </p>

                <h2 className="mt-3">7. Payments & Fees</h2>
                <ul>
                  <li>Service or transaction fees may apply</li>
                  <li>Payments must use approved methods</li>
                  <li>Fees are non-refundable unless stated otherwise</li>
                  <li>Third-party processing or conversion fees may apply</li>
                </ul>

                <h2 className="mt-3">8. Disputes</h2>
                <p>
                  Dealtous is not obligated to resolve disputes between users
                  but may assist at its discretion. Any decision made is final
                  where applicable.
                </p>

                <h2 className="mt-3">9. Third-Party Platforms</h2>
                <p>
                  Dealtous is not affiliated with Telegram, Instagram, Meta, or
                  any other social media platform. Account bans or suspensions
                  are outside our control.
                </p>

                <h2 className="mt-3">10. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Dealtous shall not be
                  liable for indirect, incidental, or consequential damages.
                </p>

                <h2 className="mt-3">11. Privacy</h2>
                <p>
                  Your use of Dealtous is governed by our Privacy Policy and
                  complies with GDPR requirements.
                </p>

                <h2 className="mt-3">12. Governing Law</h2>
                <p>
                  These Terms are governed by the laws of{" "}
                  <strong>Hungary</strong>. Courts of Budapest shall have
                  exclusive jurisdiction.
                </p>

                <h2 className="mt-3">13. Contact Information</h2>
                <p>
                  <strong>Dealtous Support</strong>
                  <br /><br />
                  Contact: 48471503587 
                  <br />
                  Email: support@dealtous.com
                  <br />
                  Location: Budapest, Hungary
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterOne />
    </>
  );
};

export default page;
