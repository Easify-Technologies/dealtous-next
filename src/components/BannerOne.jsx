const BannerOne = () => {
  return (
    <>
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
                  <h1 className="hero-inner__title">
                    Buy and Sell Verified Telegram Channels
                  </h1>
                  <p className="hero-inner__desc font-18">
                    Explore the #1 Marketplace for Telegram Channels where you
                    can buy and sell verified Telegram channels securely.
                  </p>
                  <div className="">
                    <button type="button" className="btn btn-main pill">
                      Browse Products
                    </button>
                    <button type="button" className="btn btn-main pill" style={{ marginLeft: "12px" }}>
                      Sell Your Products
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-thumb">
                <img
                  src="assets/images/thumbs/slider-2023-07-19-03-54-26-8823-768x581.png"
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
    </>
  );
};

export default BannerOne;
