"use client";

import { FaUpload, FaHandshake } from "react-icons/fa";
import { IoPhonePortrait } from "react-icons/io5";
import { BsTelegram } from "react-icons/bs";
import { BiSolidDollarCircle } from "react-icons/bi";

const FeaturedAuthor = () => {
  return (
    <section className="top-author padding-y-120 section-bg position-relative z-index-1">
      <img
        src="assets/images/gradients/featured-gradient.png"
        alt=""
        className="bg--gradient white-version"
      />
      <img
        src="assets/images/shapes/spider-net.png"
        alt=""
        className="spider-net position-absolute top-0 start-0 z-index--1 white-version"
      />
      <img
        src="assets/images/shapes/spider-net-white2.png"
        alt=""
        className="spider-net position-absolute top-0 start-0 z-index--1 dark-version"
      />
      <img
        src="assets/images/shapes/pattern-curve-three.png"
        alt=""
        className="position-absolute top-0 end-0 z-index--1"
      />
      <img
        src="assets/images/shapes/element1.png"
        alt=""
        className="element two"
      />
      <div className="container container-two">
        <div className="row gy-4 align-items-center">
          <div className="col-xl-5">
            <div className="section-content">
              <div className="section-heading style-left">
                <h3 className="section-heading__title">How It Works</h3>
                <p className="section-heading__desc font-18 w-sm">
                  Dealtous is a secure marketplace where users can buy and sell
                  Telegram channels and social accounts with confidence. It
                  guides sellers through channel submission, ownership
                  verification, and listing, and enables buyers to browse
                  verified listings with transparent metrics.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="circle-content position-relative">
              <div className="row gy-4 card-wrapper">
                <div className="col-sm-6">
                  <div className="product-item box-shadow">
                    <div className="product-item__content">
                      <div className="item-work_box">
                        <div className="item-work_icon">
                          <FaUpload size={22} />
                        </div>
                        <span>Submit your Telegram channel</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="product-item box-shadow">
                    <div className="product-item__content">
                      <div className="item-work_box">
                        <div className="item-work_icon">
                          <IoPhonePortrait size={22} />
                        </div>
                        <span>Verify ownership with our PIN Systems</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="product-item box-shadow">
                    <div className="product-item__content">
                      <div className="item-work_box">
                        <div className="item-work_icon">
                          <BsTelegram size={22} />
                        </div>
                        <span>We list your channels</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="product-item box-shadow">
                    <div className="product-item__content">
                      <div className="item-work_box">
                        <div className="item-work_icon">
                          <FaHandshake size={22} />
                        </div>
                        <span>Buyers purchases with confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 mt-4 mt-sm-0">
                  <div className="product-item box-shadow">
                    <div className="product-item__content item-paid_box">
                      <div className="item-work_box">
                        <div className="item-work_icon">
                          <BiSolidDollarCircle size={22} />
                        </div>
                        <span>You get Paid!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuthor;
