"use client";

import Slider from "react-slick";

const Testimonial = () => {
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
            <h3 className="section-heading__title">Our Customer feedback</h3>
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
              <div className="testimonial-item__rating mb-3">
                <ul className="star-rating">
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                </ul>
              </div>
              <p className="testimonial-item__desc">
                “Dealtous: Saved me months of lead gen! Bought active FB group,
                instant community. Boost conversions, skip the startup grind.
                Choose Dealtous, grow faster!”
              </p>
              <div className="testimonial-item__quote">
                <img
                  src="assets/images/icons/quote.svg"
                  alt=""
                  className="quote quote-white"
                />
                <img
                  src="assets/images/icons/quote-dark.svg"
                  alt=""
                  className="quote quote-dark"
                />
              </div>
              <div className="client-info d-flex align-items-center gap-3">
                <div className="client-info__thumb">
                  <img src="assets/images/clients/sarah-t20240102113909-767x763.jpg" alt="" />
                </div>
                <div className="client-info__content">
                  <h5 className="client-info__name mb-2">Ginger MCclain</h5>
                  <span className="client-info__designation text-heading fw-500">
                    Influencer
                  </span>
                </div>
              </div>
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
              <div className="testimonial-item__rating mb-3">
                <ul className="star-rating">
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                </ul>
              </div>
              <p className="testimonial-item__desc">
                “Dealtous saved me time & $$ building my brand. Launched with a
                perfect Insta account, ready to rock! Start smart, choose
                Dealtous.”
              </p>
              <div className="testimonial-item__quote">
                <img
                  src="assets/images/icons/quote.svg"
                  alt=""
                  className="quote quote-white"
                />
                <img
                  src="assets/images/icons/quote-dark.svg"
                  alt=""
                  className="quote quote-dark"
                />
              </div>
              <div className="client-info d-flex align-items-center gap-3">
                <div className="client-info__thumb">
                  <img src="assets/images/clients/cameron-williamson-20230923114738-150x150.png" alt="" />
                </div>
                <div className="client-info__content">
                  <h5 className="client-info__name mb-2">John D</h5>
                  <span className="client-info__designation text-heading fw-500">
                    Team Lead
                  </span>
                </div>
              </div>
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
              <div className="testimonial-item__rating mb-3">
                <ul className="star-rating">
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                  <li className="star-rating__item">
                    <i className="fas fa-star" />
                  </li>
                </ul>
              </div>
              <p className="testimonial-item__desc">
                “Buyer: Doubting social media buys? Dealtous changed it! Found
                my perfect account, easy & transparent. At Support! Buy/sell with
                confidence!”
              </p>
              <div className="testimonial-item__quote">
                <img
                  src="assets/images/icons/quote.svg"
                  alt=""
                  className="quote quote-white"
                />
                <img
                  src="assets/images/icons/quote-dark.svg"
                  alt=""
                  className="quote quote-dark"
                />
              </div>
              <div className="client-info d-flex align-items-center gap-3">
                <div className="client-info__thumb">
                  <img src="assets/images/clients/sarah-t20240102113909-767x763.jpg" alt="" />
                </div>
                <div className="client-info__content">
                  <h5 className="client-info__name mb-2">Sarah T</h5>
                  <span className="client-info__designation text-heading fw-500">
                    Seller
                  </span>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
