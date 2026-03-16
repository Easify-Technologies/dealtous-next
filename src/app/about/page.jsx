import React from "react";

import Link from "next/link";
import Preloader from "@/helper/Preloader";
import HeaderOne from "@/components/HeaderOne";
import FooterOne from "@/components/FooterOne";
import Testimonial from "@/components/Testimonial";

import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FaCreditCard, FaImage } from "react-icons/fa6";
import { RiTeamFill } from "react-icons/ri";

export const metadata = {
  title: "About Us | Dealtous",
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

      {/* BANNER */}
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
          <div className="row align-items-center gy-sm-5 gy-4">
            <div className="col-lg-6">
              <div className="hero-inner position-relative pe-lg-5">
                <div>
                  <h1 className="hero-inner__title">About</h1>
                  <h3>We’re Confident You’d Business Success.</h3>
                  <p className="hero-inner__desc font-18">
                    Dealtous, your verified social marketplace. Skip months of
                    audience building, buy the perfect Instagram, Twitter or
                    Facebook account instantly. Sellers, monetize your existing
                    communities with ease. We handle secure transfers, verify
                    profiles, and ensure all deals are legit. Grow your brand,
                    and join the Dealtous revolution.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-thumb">
                <img
                  src="assets/images/about-us-2023-08-23-06-22-18-5675-768x630.png"
                  alt=""
                />
                <img
                  src="assets/images/shapes/dots.png"
                  alt=""
                  className="dotted-img white-version"
                />
                <img
                  src="assets/images/shapes/dots-white.png"
                  alt=""
                  className="dotted-img dark-version"
                />
                <img
                  src="assets/images/shapes/element2.png"
                  alt=""
                  className="element two end-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="arrival-product padding-t-60 section-bg position-relative z-index-1">
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
      </section>

      <section className="offer-bg">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="offer-inner-content">
                <div className="offer-description">
                  <h2 className="text-white">
                    Unlock Verified Accounts. Dealtous.
                  </h2>
                  <h5 className="mb-0 text-white">Instant Support</h5>
                </div>
                <Link
                  scroll={false}
                  href="/contact"
                  className="inner-content_btn"
                >
                  Contact Us
                </Link>
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
                  <div className="product-item box-shadow">
                    <div className="product-item__content">
                      <div className="about-choose_title">
                        <FaCreditCard size={26} className="about-choose_logo" />
                        <h6 className="mb-0 text-center">Instant Growth, Verified Trust</h6>
                      </div>
                      <div className="product-item__info text-center">
                        <span className="product-item__author mt-3">
                          Buy engaged accounts, skip the wait, grow smart. Dealtous - your shortcut to social success.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="product-item box-shadow">
                    <div className="product-item__content">
                      <div className="about-choose_title">
                        <RiTeamFill size={26} className="about-choose_logo" />
                        <h6 className="mb-0 text-center">Expert Team Member</h6>
                      </div>
                      <div className="product-item__info text-center">
                        <span className="product-item__author mt-3">
                          Dealtous was created by a team of expert professionals in social networks and developed by programmers with experience in the sector.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="product-item box-shadow">
                    <div className="product-item__content">
                      <div className="about-choose_title">
                        <FaImage size={26} className="about-choose_logo" />
                        <h6 className="mb-0 text-center">Outstanding Simplicity</h6>
                      </div>
                      <div className="product-item__info text-center">
                        <span className="product-item__author mt-3">
                          We make the work simple so you can grow quickly and reliably.
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
                  <h3 className="section-heading__title">
                    Why Choose Dealtous
                  </h3>
                  <p className="section-heading__desc font-18 w-sm">
                    Dealtous, your verified social marketplace. Skip months of
                    audience building, buy the perfect Instagram, Twitter or
                    Facebook account instantly. Sellers, monetize your existing
                    communities with ease. We handle secure transfers, verify
                    profiles, and ensure all deals are legit. Grow your brand,
                    and join the Dealtous revolution.
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

      <Testimonial />

      <FooterOne />
    </>
  );
};

export default page;
