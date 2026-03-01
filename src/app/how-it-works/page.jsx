import React from "react";

import Link from "next/link";
import Preloader from "../../helper/Preloader";
import FooterOne from "../../components/FooterOne";
import HeaderOne from "../../components/HeaderOne";
import HowItWorks from "../../components/HowItWorks";

import { MdOutlineSecurity, MdSearch } from "react-icons/md";
import { LuNotepadText } from "react-icons/lu";
import { GiNotebook } from "react-icons/gi";
import { FaRegHandshake, FaBullhorn } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
import { HiOutlineMailOpen } from "react-icons/hi";
import { SiAdguard } from "react-icons/si";
import { TiTick } from "react-icons/ti";
import { TfiMenuAlt } from "react-icons/tfi";
import { PiDotFill } from "react-icons/pi";

export const metadata = {
  title: "How It Works | Dealtous",
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

      <section className="arrival-product padding-y-120 section-bg position-relative z-index-1">
        <img
          src="assets/images/gradients/product-gradient.png"
          alt=""
          className="bg--gradient white-version"
        />
        <img
          src="assets/images/shapes/element2.png"
          alt=""
          className="element one"
        />
        <div className="container container-two">
          <div className="section-heading how-works_heading">
            <h3 className="section-heading__title">
              Buy a Telegram Channel on Dealtous
            </h3>
          </div>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-all"
              role="tabpanel"
              aria-labelledby="pills-all-tab"
              tabIndex={0}
            >
              <div className="row gy-4">
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <MdSearch size={20} />
                        </div>
                        <h6 className="mb-0">Browse Listing</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <LuNotepadText size={20} />
                        </div>
                        <h6 className="mb-0">Request Info</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <GiNotebook size={20} />
                        </div>
                        <h6 className="mb-0">Verified Data</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <FaRegHandshake size={20} />
                        </div>
                        <h6 className="mb-0">Get Verified or Buy Now</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <MdOutlineSecurity size={20} />
                        </div>
                        <h6 className="mb-0 text-center">Payment via Escrow</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <HiMiniUserGroup size={20} />
                        </div>
                        <h6 className="mb-0">Ownership Transfer</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <HiOutlineMailOpen size={20} />
                        </div>
                        <h6 className="mb-0">After Sale Support</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <div className="product-item box-shadow buyer_box">
                    <div className="product-item__content">
                      <h5 className="mob_heading">FAQs For Buyers</h5>
                      <div className="product-item__info">
                        <ul className="buy-ul-list">
                          <li>
                            <PiDotFill size={20} className="list-tick_icon" />
                            <span>How do i know if the channel is real?</span>
                          </li>
                          <li>
                            <PiDotFill size={20} className="list-tick_icon" />
                            <span>What payment methods are accepted?</span>
                          </li>
                          <li>
                            <PiDotFill size={20} className="list-tick_icon" />
                            <span>Can I speak with seller first?</span>
                          </li>
                          <li>
                            <PiDotFill size={20} className="list-tick_icon" />
                            <span>How is ownership tranferred?</span>
                          </li>
                          <li>
                            <PiDotFill size={20} className="list-tick_icon" />
                            <span>
                              What if the channel is not as described?
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="section-content">
                <div className="section-heading style-left">
                  <h3 className="section-heading__title mob_heading">
                    Why Buy On Dealtous
                  </h3>
                  <ul className="buy-ul-list">
                    <li>
                      <TiTick size={20} className="list-tick_icon" />
                      <span>Channel are verified before listings</span>
                    </li>
                    <li>
                      <TiTick size={20} className="list-tick_icon" />
                      <span>Optional Escrow system</span>
                    </li>
                    <li>
                      <TiTick size={20} className="list-tick_icon" />
                      <span>Seller identity verification</span>
                    </li>
                    <li>
                      <TiTick size={20} className="list-tick_icon" />
                      <span>Screenshots / engagement data required</span>
                    </li>
                    <li>
                      <TiTick size={20} className="list-tick_icon" />
                      <span>Contracts or Terms of sale on request</span>
                    </li>
                  </ul>
                </div>
                <Link
                  scroll={false}
                  href="/all-product"
                  className="btn btn-main btn-lg pill fw-300"
                >
                  Start Browsing Telegram Channels
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="arrival-product padding-y-120 section-bg position-relative z-index-1">
        <img
          src="assets/images/gradients/product-gradient.png"
          alt=""
          className="bg--gradient white-version"
        />
        <img
          src="assets/images/shapes/element2.png"
          alt=""
          className="element one"
        />
        <div className="container container-two">
          <div className="section-heading how-works_heading">
            <h3 className="section-heading__title">
              Selling your Telegram Channel on Dealtous
            </h3>
          </div>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-all"
              role="tabpanel"
              aria-labelledby="pills-all-tab"
              tabIndex={0}
            >
              <div className="row gy-4">
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <FaBullhorn size={20} />
                        </div>
                        <h6 className="mb-0">Submit Channel</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <HiOutlineMailOpen size={20} />
                        </div>
                        <h6 className="mb-0">Verify Ownership</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <HiMiniUserGroup size={20} />
                        </div>
                        <h6 className="mb-0">Manual Meeting</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <TiTick size={20} />
                        </div>
                        <h6 className="mb-0">Set Asking Price</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <TfiMenuAlt size={20} />
                        </div>
                        <h6 className="mb-0 text-center">List & Find Buyer</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <MdOutlineSecurity size={20} />
                        </div>
                        <h6 className="mb-0">Payment via Escrow</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="product-item">
                    <div className="product-item__content">
                      <div className="how-works_upper">
                        <div className="how-works_icon">
                          <HiOutlineMailOpen size={20} />
                        </div>
                        <h6 className="mb-0">After Sale Support</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="offer-bg">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="text-white text-center">
                Escrow and Direct Payment
              </h3>
              <p className="text-white text-center">
                Only channels that successfully pass all steps are allowed to be
                listed or sold on Dealtous. Your safety is our priority.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-xs-12">
                <div className="escrow-section_box mb-4 mb-sm-0">
                  <div className="escrow-box_child">
                    <div className="escrow-box_icon">
                      <SiAdguard size={24} />
                    </div>
                    <div className="escrow-box_head">
                      <h6 className="mb-0 text-white">Escrow</h6>
                      <span className="text-white">+5% escrow fee</span>
                    </div>
                  </div>
                  <ul className="buy-ul-list mt-3">
                    <li>
                      <PiDotFill size={20} className="list-tick_icon" />
                      <span className="text-white">
                        How many channel may I list?
                      </span>
                    </li>
                    <li>
                      <PiDotFill size={20} className="list-tick_icon" />
                      <span className="text-white">
                        How can I verify channel ownership?
                      </span>
                    </li>
                    <li>
                      <PiDotFill size={20} className="list-tick_icon" />
                      <span className="text-white">
                        Do you gurantee I'll find you buyer?
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-sm-12 col-xs-12">
                <div className="escrow-section_box">
                  <div className="escrow-box_child">
                    <div className="escrow-box_icon">
                      <FaRegHandshake size={24} />
                    </div>
                    <div className="escrow-box_head">
                      <h6 className="mb-0 text-white">Direct Payment</h6>
                      <span className="text-white">No extra charges</span>
                    </div>
                  </div>
                  <ul className="buy-ul-list mt-3">
                    <li>
                      <PiDotFill size={20} className="list-tick_icon" />
                      <span className="text-white">
                        No escrow fee
                      </span>
                    </li>
                    <li>
                      <PiDotFill size={20} className="list-tick_icon" />
                      <span className="text-white">
                        Buyer pays seller directly
                      </span>
                    </li>
                    <li>
                      <PiDotFill size={20} className="list-tick_icon" />
                      <span className="text-white">
                        Dealtous mediates issues
                      </span>
                    </li>
                  </ul>
                </div>
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
