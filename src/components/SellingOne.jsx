"use client";

import Link from "next/link";
import Slider from "react-slick";

const SellingOne = () => {
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className="las la-arrow-right" />
      </button>
    );
  }
  function SamplePrevArrow(props) {
    const { className, onClick } = props;

    return (
      <button className={className} onClick={onClick}>
        <i className="las la-arrow-left" />
      </button>
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: false, // IMPORTANT for only 2 items
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    responsive: [
      {
        breakpoint: 768, // tablet & below
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        },
      },
    ],
  };

  return (
    <section className="selling-product padding-y-120 position-relative z-index-1 overflow-hidden">
      <img
        src="assets/images/gradients/selling-gradient.png"
        alt=""
        className="bg--gradient"
      />
      <img
        src="assets/images/shapes/element2.png"
        alt=""
        className="element one"
      />
      <img
        src="assets/images/shapes/element1.png"
        alt=""
        className="element two"
      />
      <img
        src="assets/images/shapes/curve-pattern1.png"
        alt=""
        className="position-absolute start-0 top-0 z-index--1"
      />
      <img
        src="assets/images/shapes/curve-pattern2.png"
        alt=""
        className="position-absolute end-0 top-0 z-index--1"
      />
      <div className="container container-two">
        <div className="section-heading style-left style-white flx-between max-w-unset gap-4">
          <div>
            <h3 className="section-heading__title">
              check our listing with huge discount
            </h3>
          </div>
          <Link
            scroll={false}
            href="/all-product"
            className="btn btn-main btn-lg pill fw-300"
          >
            View All Items
          </Link>
        </div>
        <div className="selling-product-slider">
          <Slider {...settings}>
            <div className="product-item shadow-sm overlay-none">
              <div className="product-item__thumb d-flex max-h-unset">
                <Link
                  scroll={false}
                  href="/product-details"
                  className="link w-100"
                >
                  <img
                    src="assets/images/offer-2023-10-09-11-44-33-7684-1024x512.png"
                    alt=""
                    className="cover-img"
                  />
                </Link>
              </div>
              <div className="product-item__content">
                <h6 className="product-item__title">
                  <Link scroll={false} href="/product-details" className="link">
                    Buy Speedly On Dealtous
                  </Link>
                </h6>
                <div className="product-item__info flx-between gap-2">
                  <span className="product-item__author">
                    Purchase Social Media Accounts At the Best price and with
                    the best customer support
                  </span>
                </div>
                <Link href="#" className="mt-2 btn btn-main pill">
                  Buy Now
                </Link>
              </div>
            </div>
            <div className="product-item shadow-sm overlay-none">
              <div className="product-item__thumb d-flex max-h-unset">
                <Link
                  scroll={false}
                  href="/product-details"
                  className="link w-100"
                >
                  <img
                    src="assets/images/offer-2023-10-09-11-44-33-7684-1024x512.png"
                    alt=""
                    className="cover-img"
                  />
                </Link>
              </div>
              <div className="product-item__content">
                <h6 className="product-item__title">
                  <Link scroll={false} href="/product-details" className="link">
                    Sell Your Account Here
                  </Link>
                </h6>
                <div className="product-item__info flx-between gap-2">
                  <span className="product-item__author">
                    Sell Social Media Accounts At the Best price and with the
                    best customer support
                  </span>
                </div>
                <Link href="#" className="mt-2 btn btn-main pill">
                  Sell Now
                </Link>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default SellingOne;
