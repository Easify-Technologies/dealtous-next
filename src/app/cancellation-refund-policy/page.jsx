import React from "react";

import Preloader from "../../helper/Preloader";
import HeaderOne from "../../components/HeaderOne";
import FooterOne from "../../components/FooterOne";

export const metadata = {
  title: "Cancellation & Refund Policy | Dealtous",
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
                <h1 className="hero-inner__title">
                  Cancellation & Refund Policy
                </h1>

                <p className="text-muted mb-4">
                  <strong>Last updated:</strong> 31-01-2026
                </p>

                <p>
                  This Cancellation & Refund Policy explains the conditions
                  under which cancellations and refunds may be requested on{" "}
                  <strong>Dealtous</strong> (“Platform”, “we”, “our”, “us”).
                </p>

                <p>
                  Dealtous is an online marketplace for the purchase and sale of
                  digital assets, including social media accounts and channels.
                  Due to the nature of digital goods, refund rights are limited
                  and subject to strict conditions.
                </p>

                <h2 className="mt-3">1. General Policy</h2>
                <ul>
                  <li>
                    All transactions on Dealtous involve{" "}
                    <strong>digital goods</strong>
                  </li>
                  <li>
                    Once access credentials or ownership of a digital asset are
                    transferred, the transaction is considered{" "}
                    <strong>completed</strong>
                  </li>
                  <li>
                    Refunds are <strong>not guaranteed</strong> and are granted
                    only in specific cases outlined below
                  </li>
                </ul>

                <h2 className="mt-3">2. Order Cancellation</h2>
                <p>
                  Buyers may request a cancellation <strong>only before</strong>{" "}
                  the seller has delivered account access or completed the
                  transfer.
                </p>
                <ul>
                  <li>Cancellation requests must be submitted immediately</li>
                  <li>
                    Once account credentials are shared or control is
                    transferred, cancellation is no longer possible
                  </li>
                  <li>
                    Sellers may also cancel an order if they are unable to
                    complete the transaction
                  </li>
                </ul>

                <h2 className="mt-3">3. Refund Eligibility</h2>
                <p>
                  A refund may be considered only under the following
                  circumstances:
                </p>
                <br />
                <ul>
                  <li>The seller fails to deliver the account or asset</li>
                  <li>
                    The delivered account is materially different from its
                    listing
                  </li>
                  <li>Fraudulent activity is confirmed by Dealtous</li>
                  <li>
                    Payment was processed but the transaction did not complete
                  </li>
                </ul>

                <h2 className="mt-3">4. Non-Refundable Situations</h2>
                <p>
                  Refunds will <strong>not</strong> be issued in the following
                  cases:
                </p>
                <br />
                <ul>
                  <li>
                    The buyer changes their mind after receiving account access
                  </li>
                  <li>
                    The account is suspended, banned, or restricted by a
                    third-party platform after delivery
                  </li>
                  <li>
                    The buyer violates the terms of the social media platform
                  </li>
                  <li>
                    Incorrect use, mishandling, or security changes made by the
                    buyer
                  </li>
                  <li>
                    Delays caused by third-party services outside Dealtous’s
                    control
                  </li>
                </ul>

                <h2 className="mt-3">5. EU Right of Withdrawal</h2>
                <p>
                  Under EU consumer law, the right of withdrawal does{" "}
                  <strong>not apply</strong> to digital content once delivery
                  has begun with the consumer’s prior consent and acknowledgment
                  that they lose their right of withdrawal.
                </p>

                <p>
                  By completing a purchase on Dealtous, you expressly consent to
                  the immediate delivery of digital content and acknowledge that
                  you waive your right of withdrawal once delivery begins.
                </p>

                <h2 className="mt-3">6. Refund Process</h2>
                <ul>
                  <li>
                    Refund requests must be submitted through Dealtous support
                  </li>
                  <li>
                    Requests must include relevant transaction details and
                    evidence
                  </li>
                  <li>
                    All refund decisions are made at Dealtous’s discretion
                  </li>
                  <li>
                    Approved refunds will be issued to the original payment
                    method
                  </li>
                </ul>

                <h2 className="mt-3">7. Processing Time</h2>
                <p>
                  If approved, refunds are typically processed within{" "}
                  <strong>5–10 business days</strong>, depending on the payment
                  provider.
                </p>

                <h2 className="mt-3">8. Fees & Charges</h2>
                <ul>
                  <li>
                    Service and transaction fees are generally non-refundable
                  </li>
                  <li>
                    Payment processor or currency conversion fees may not be
                    recoverable
                  </li>
                </ul>

                <h2 className="mt-3">9. Dispute Resolution</h2>
                <p>
                  In the event of a dispute, Dealtous may temporarily hold funds
                  until the issue is reviewed. Decisions made by Dealtous in
                  dispute cases are final where permitted by law.
                </p>

                <h2 className="mt-3">10. Policy Updates</h2>
                <p>
                  We may update this Cancellation & Refund Policy from time to
                  time. Changes will take effect upon publication on the
                  Platform.
                </p>

                <h2 className="mt-3">11. Contact Information</h2>
                <p>For cancellation or refund requests, please contact:</p>
                <br />
                <p>
                  <strong>Dealtous Support</strong>
                  <br /><br />
                  Conact: 48471503587
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
