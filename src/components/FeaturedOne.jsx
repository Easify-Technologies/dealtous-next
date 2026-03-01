import Link from "next/link";

import { FaCircleCheck } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaTelegram } from "react-icons/fa";

const FeaturedOne = () => {
  return (
    <section className="featured-product padding-y-120 position-relative z-index-1">
      <img
        src="assets/images/gradients/featured-gradient.png"
        alt=""
        className="bg--gradient white-version"
      />
      <img
        src="assets/images/shapes/spider-net.png"
        alt=""
        className="spider-net position-absolute top-0 end-0 z-index--1 white-version"
      />
      <img
        src="assets/images/shapes/spider-net-white.png"
        alt=""
        className="spider-net position-absolute top-0 end-0 z-index--1 dark-version"
      />
      <img
        src="assets/images/shapes/element1.png"
        alt=""
        className="element two"
      />
      <div className="container container-two">
        <div className="row gy-4 flex-wrap-reverse align-items-center">
          <div className="col-xl-6">
            <div className="row gy-4 card-wrapper">
              <div className="col-sm-6">
                <div className="product-item box-shadow">
                  <div className="product-item__content">
                    <div className="featured-item_title">
                      <FaCircleCheck size={25} style={{ fill: "#325feb" }} />
                      <h6 className="mb-0">Verified Listing</h6>
                    </div>
                    <div className="product-item__info flx-between gap-2">
                      <span className="product-item__author mt-3">
                        Every Channel is manually verified to prevent scams.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="product-item box-shadow">
                  <div className="product-item__content">
                    <div className="featured-item_title">
                      <AiFillDollarCircle size={25} style={{ fill: "#325feb" }} />
                      <h6 className="mb-0">Escrow-ready System</h6>
                    </div>
                    <div className="product-item__info flx-between gap-2">
                      <span className="product-item__author mt-3">
                        Future-proof with escrow and secure payments.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="product-item box-shadow">
                  <div className="product-item__content">
                    <div className="featured-item_title">
                      <FaTelegram size={25} style={{ fill: "#325feb" }} />
                      <h6 className="mb-0">Telegram Experts</h6>
                    </div>
                    <div className="product-item__info flx-between gap-2">
                      <span className="product-item__author mt-3">
                        Run by a team of Telegram-focused marketers and dev.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-1 d-xl-block d-none" />
          <div className="col-xl-5">
            <div className="section-content">
              <div className="section-heading style-left">
                <h3 className="section-heading__title">Why Choose Dealtous</h3>
                <p className="section-heading__desc font-18 w-sm">
                  Dealtous, your verified social marketplace. Skip months of
                  audience building, buy the perfect Instagram, Twitter or
                  Facebook account instantly. Sellers, monetize your existing
                  communities with ease. We handle secure transfers, verify
                  profiles, and ensure all deals are legit. Grow your brand, and
                  join the Dealtous revolution.
                </p>
              </div>
              <Link
                scroll={false}
                href="all-product"
                className="btn btn-main btn-lg pill fw-300"
              >
                View All Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOne;
