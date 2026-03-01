import React from "react";

import Preloader from "../../helper/Preloader";
import HeaderOne from "../../components/HeaderOne";
import FooterOne from "../../components/FooterOne";

export const metadata = {
  title: "Privacy Policy | Dealtous",
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
                <h1 className="hero-inner__title">Privacy Policy</h1>

                <p className="text-muted mb-4">
                  <strong>Last updated:</strong> 31-01-2026
                </p>

                <p>
                  This Privacy Policy explains how <strong>Dealtous</strong>{" "}
                  (“we”, “our”, “us”) collects, uses, stores, and protects your
                  personal data when you use our application, website, and
                  related services (collectively, the “Platform”).
                </p>

                <p>
                  Dealtous is based in <strong>Budapest, Hungary</strong> and
                  processes personal data in accordance with the{" "}
                  <strong>General Data Protection Regulation (GDPR)</strong> and
                  applicable Hungarian laws.
                </p>

                <h2 className="mt-3">1. Data Controller</h2>
                <p>
                  <strong>Dealtous</strong>
                  <br />
                  Location: Budapest, Hungary
                  <br />
                  Email: support@dealtous.com
                </p>

                <h2 className="mt-3">2. Personal Data We Collect</h2>
                <p>We may collect the following categories of personal data:</p>
                <br />
                <ul>
                  <li>Identity information (name, username)</li>
                  <li>Contact details (email address)</li>
                  <li>Account credentials and profile information</li>
                  <li>Transaction and payment information</li>
                  <li>Communication data (support messages, emails)</li>
                  <li>
                    Technical data (IP address, browser type, device
                    information)
                  </li>
                </ul>

                <h2 className="mt-3">3. How We Use Your Data</h2>
                <p>Your personal data is used to:</p>
                <br />
                <ul>
                  <li>Provide and operate the Dealtous Platform</li>
                  <li>Create and manage user accounts</li>
                  <li>Process transactions and payments</li>
                  <li>Communicate with users regarding services or support</li>
                  <li>Prevent fraud and unauthorized activities</li>
                  <li>Comply with legal and regulatory obligations</li>
                </ul>

                <h2 className="mt-3">4. Legal Basis for Processing (GDPR)</h2>
                <p>
                  We process your personal data based on one or more of the
                  following legal grounds:
                </p>
                <br />
                <ul>
                  <li>Your consent</li>
                  <li>Performance of a contract</li>
                  <li>Compliance with legal obligations</li>
                  <li>Legitimate business interests</li>
                </ul>

                <h2 className="mt-3">5. Data Sharing & Third Parties</h2>
                <p>
                  We do <strong>not sell</strong> your personal data. We may
                  share data only with:
                </p>
                <br />
                <ul>
                  <li>Payment processors and financial service providers</li>
                  <li>Cloud hosting and infrastructure providers</li>
                  <li>Legal or regulatory authorities when required by law</li>
                </ul>

                <h2 className="mt-3">6. International Data Transfers</h2>
                <p>
                  If personal data is transferred outside the European Economic
                  Area (EEA), we ensure appropriate safeguards are in place in
                  accordance with GDPR requirements.
                </p>

                <h2 className="mt-3">7. Data Retention</h2>
                <p>
                  We retain personal data only for as long as necessary to
                  fulfill the purposes outlined in this Policy, unless a longer
                  retention period is required by law.
                </p>

                <h2 className="mt-3">8. Your GDPR Rights</h2>
                <p>You have the right to:</p>
                <br />
                <ul>
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion (“right to be forgotten”)</li>
                  <li>Restrict or object to data processing</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <br />

                <p>
                  To exercise your rights, contact us at:{" "}
                  <strong>support@dealtous.com</strong>
                </p>

                <h2 className="mt-3">9. Cookies & Tracking</h2>
                <p>
                  Dealtous may use cookies and similar technologies to improve
                  user experience, analyze usage, and enhance platform
                  performance. You can manage cookie preferences through your
                  browser settings.
                </p>

                <h2 className="mt-3">10. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security
                  measures to protect your personal data against unauthorized
                  access, loss, or misuse.
                </p>

                <h2 className="mt-3">11. Third-Party Links</h2>
                <p>
                  Our Platform may contain links to third-party websites. We are
                  not responsible for their privacy practices or content.
                </p>

                <h2 className="mt-3">12. Children’s Privacy</h2>
                <p>
                  Dealtous is not intended for users under the age of 18. We do
                  not knowingly collect personal data from minors.
                </p>

                <h2 className="mt-3">13. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Changes
                  will be effective upon posting on the Platform.
                </p>

                <h2 className="mt-3">14. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or
                  your data, please contact:
                </p>
                <br />
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
