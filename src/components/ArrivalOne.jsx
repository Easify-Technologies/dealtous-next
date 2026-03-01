import Link from "next/link";

const ArrivalOne = () => {
  return (
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
        <div className="section-heading">
          <h3 className="section-heading__title">Feature Telegram Channels</h3>
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
                  <div className="product-item__thumb d-flex">
                    <Link scroll={false} href="/product-details" className="link w-100">
                      <img
                        src="assets/images/consoler.png"
                        alt=""
                        className="cover-img"
                      />
                    </Link>
                    <button type="button" className="product-item__wishlist">
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                  <div className="product-item__content">
                    <h6 className="product-item__title">
                      <Link
                        scroll={false}
                        href="/product-details"
                        className="link"
                      >
                        Entertainment
                      </Link>
                    </h6>
                    <div className="product-item__info flx-between gap-2">
                      <span className="product-item__author">
                        5,00,000 subscribers
                      </span>
                      <div className="flx-align gap-2">
                        <h6 className="product-item__price mb-0">$2000</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="product-item">
                  <div className="product-item__thumb d-flex">
                    <Link
                      scroll={false}
                      href="/product-details"
                      className="link w-100"
                    >
                      <img
                        src="assets/images/gaming.jpg"
                        alt=""
                        className="cover-img"
                      />
                    </Link>
                    <button type="button" className="product-item__wishlist">
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                  <div className="product-item__content">
                    <h6 className="product-item__title">
                      <Link
                        scroll={false}
                        href="/product-details"
                        className="link"
                      >
                        Gaming
                      </Link>
                    </h6>
                    <div className="product-item__info flx-between gap-2">
                      <span className="product-item__author">
                        30,000 subscribers
                      </span>
                      <div className="flx-align gap-2">
                        <h6 className="product-item__price mb-0">$200</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="product-item">
                  <div className="product-item__thumb d-flex">
                    <Link
                      scroll={false}
                      href="/product-details"
                      className="link w-100"
                    >
                      <img
                        src="assets/images/hq720-1024x576.jpg"
                        alt=""
                        className="cover-img"
                      />
                    </Link>
                    <button type="button" className="product-item__wishlist">
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                  <div className="product-item__content">
                    <h6 className="product-item__title">
                      <Link
                        scroll={false}
                        href="/product-details"
                        className="link"
                      >
                        E-commerce
                      </Link>
                    </h6>
                    <div className="product-item__info flx-between gap-2">
                      <span className="product-item__author">
                        3,00,00 subscribers
                      </span>
                      <div className="flx-align gap-2">
                        <h6 className="product-item__price mb-0">$250</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6">
                <div className="product-item">
                  <div className="product-item__thumb d-flex">
                    <Link
                      scroll={false}
                      href="/product-details"
                      className="link w-100"
                    >
                      <img
                        src="assets/images/blog-telegram-2048x1152.jpg"
                        alt=""
                        className="cover-img"
                      />
                    </Link>
                    <button type="button" className="product-item__wishlist">
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                  <div className="product-item__content">
                    <h6 className="product-item__title">
                      <Link
                        scroll={false}
                        href="/product-details"
                        className="link"
                      >
                        Education
                      </Link>
                    </h6>
                    <div className="product-item__info flx-between gap-2">
                      <span className="product-item__author">
                        5,00,000 subscribers
                      </span>
                      <div className="flx-align gap-2">
                        <h6 className="product-item__price mb-0">$1650</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-64">
          <Link
            scroll={false}
            href="/all-product"
            className="btn btn-main btn-lg pill fw-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArrivalOne;
