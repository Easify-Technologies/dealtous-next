"use client";

import Slider from "react-slick";

import { GiArchiveResearch } from "react-icons/gi";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { SiAdguard } from "react-icons/si";

const HowItWorks = () => {
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
    dots: true,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
           dots: false,
        },
      },
    ],
  };
  return (
    <section className="testimonial padding-y-120 position-relative section-bg overflow-hidden">
      <img
        src="assets/images/shapes/brush.png"
        alt=""
        className="element-brush"
      />
      <div className="container container-two">
        <div className="section-heading style-left style-flex flx-between align-items-end gap-3">
          <div className="section-heading__inner w-lg">
            <h3 className="section-heading__title">Channel Verification Process Explained</h3>
            <p className="testimonial-item__desc mb-0">Only channels that successfully pass all steps are allowed to be listed or sold on Dealtous. Your safety is our priority.</p>
          </div>
        </div>
        <div className="testimonial-slider">
          <Slider {...settings}>
            <div className="testimonial-item hover-bg-main">
              <img
                src="assets/images/gradients/testimonial-bg.png"
                alt=""
                className="hover-bg white-version"
              />
              <img
                src="assets/images/gradients/testimonial-bg.png"
                alt=""
                className="hover-bg dark-version"
              />
              <div className="channel-box_icon">
                <GiArchiveResearch size={24} />
              </div>
              <h4 className="channel-item_heading">Ownership Proof</h4>
              <p className="testimonial-item__desc mb-0">
                The seller must prove they have full control of the channel. This is done via a custom verification message sent from the channel or admin panel aconfirmation.
              </p>
            </div>
            <div className="testimonial-item hover-bg-main">
              <img
                src="assets/images/gradients/testimonial-bg.png"
                alt=""
                className="hover-bg white-version"
              />
              <img
                src="assets/images/gradients/testimonial-bg.png"
                alt=""
                className="hover-bg dark-version"
              />
              <div className="channel-box_icon">
                <BsFileEarmarkBarGraphFill size={24} />
              </div>
              <h4 className="channel-item_heading">Engagement & Analytics</h4>
              <p className="testimonial-item__desc mb-0">
                We request recent screenshots and data of reach, views per post, subscriber activity, and post frequency to ensure the channel has real, active users.
              </p>
            </div>
            <div className="testimonial-item hover-bg-main">
              <img
                src="assets/images/gradients/testimonial-bg.png"
                alt=""
                className="hover-bg white-version"
              />
              <img
                src="assets/images/gradients/testimonial-bg.png"
                alt=""
                className="hover-bg dark-version"
              />
              <div className="channel-box_icon">
                <SiAdguard size={24} />
              </div>
              <h4 className="channel-item_heading">Identity Validation</h4>
              <p className="testimonial-item__desc mb-0">
                Sellers go through a personal verification process (KYC), so buyers can transact with confidence knowing who’s behind the account.
              </p>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
