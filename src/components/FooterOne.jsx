import Link from "next/link";

const FooterOne = () => {
  return (
    <>
      <footer className="footer-section">
        <img
          src="assets/images/shapes/pattern.png"
          alt=""
          className="bg-pattern"
        />
        <img
          src="assets/images/shapes/element1.png"
          alt=""
          className="element one"
        />
        <img
          src="assets/images/shapes/element2.png"
          alt=""
          className="element two"
        />
        <img
          src="assets/images/gradients/footer-gradient.png"
          alt=""
          className="bg--gradient"
        />
        <div className="container container-two">
          <div className="row gy-5">
            <div className="col-xl-3 col-sm-6">
              <div className="footer-widget">
                <div className="footer-widget__logo">
                  <Link scroll={false} href="/">
                    <img src="assets/images/logo/logo.png" alt="" />
                  </Link>
                </div>
                <p className="footer-widget__desc">
                  Explore the #1 Marketplace for Telegram Channels where you can
                  buy and sell verified Telegram channels securely.
                </p>
                <div className="footer-widget__social">
                  <ul className="social-icon-list">
                    <li className="social-icon-list__item">
                      <Link
                        scroll={false}
                        href="https://www.facebook.com"
                        className="social-icon-list__link flx-center"
                      >
                        <i className="fab fa-facebook-f" />
                      </Link>
                    </li>
                    <li className="social-icon-list__item">
                      <Link
                        scroll={false}
                        href="https://www.twitter.com"
                        className="social-icon-list__link flx-center"
                      >
                        <i className="fab fa-twitter" />
                      </Link>
                    </li>
                    <li className="social-icon-list__item">
                      <Link
                        scroll={false}
                        href="https://www.linkedin.com"
                        className="social-icon-list__link flx-center"
                      >
                        <i className="fab fa-linkedin-in" />
                      </Link>
                    </li>
                    <li className="social-icon-list__item">
                      <Link
                        scroll={false}
                        href="https://www.pinterest.com"
                        className="social-icon-list__link flx-center"
                      >
                        <i className="fab fa-pinterest-p" />
                      </Link>
                    </li>
                    <li className="social-icon-list__item">
                      <Link
                        scroll={false}
                        href="https://www.pinterest.com"
                        className="social-icon-list__link flx-center"
                      >
                        <i className="fab fa-youtube" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-sm-6 col-xs-6">
              <div className="footer-widget">
                <h5 className="footer-widget__title text-white">Quick Links</h5>
                <ul className="footer-lists">
                  <li className="footer-lists__item">
                    <Link
                      scroll={false}
                      href="/all-product"
                      className="footer-lists__link"
                    >
                      Browse
                    </Link>
                  </li>
                  <li className="footer-lists__item">
                    <Link
                      scroll={false}
                      href="/about"
                      className="footer-lists__link"
                    >
                      About
                    </Link>
                  </li>
                  <li className="footer-lists__item">
                    <Link
                      scroll={false}
                      href="/blog"
                      className="footer-lists__link"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-xs-6 ps-xl-5">
              <div className="footer-widget">
                <h5 className="footer-widget__title text-white">Consumer Policy</h5>
                <ul className="footer-lists">
                  <li className="footer-lists__item">
                    <Link
                      scroll={false}
                      href="/privacy-policy"
                      className="footer-lists__link"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="footer-lists__item">
                    <Link
                      scroll={false}
                      href="/terms-conditions"
                      className="footer-lists__link"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li className="footer-lists__item">
                    <Link
                      scroll={false}
                      href="/cancellation-refund-policy"
                      className="footer-lists__link"
                    >
                      Cancellation & Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6">
              <div className="footer-widget">
                <h5 className="footer-widget__title text-white">Subscribe</h5>
                <p className="footer-widget__desc">
                  Subscribe our newsletter to get updated the latest news
                </p>
                <form
                  action="#"
                  className="mt-4 subscribe-box d-flex align-items-center flex-column gap-2"
                >
                  <input
                    type="text"
                    className="form-control common-input pill text-white mb-2"
                    placeholder="Enter Mail"
                  />
                  <button
                    type="submit"
                    className="btn btn-main btn-lg w-100 pill"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* bottom Footer */}
      <div className="bottom-footer">
        <div className="container container-two">
          <div className="bottom-footer__inner flx-between gap-3">
            <p className="bottom-footer__text font-14">
              Copyright © 2026 Dealtous, All rights reserved.
            </p>
            <div className="footer-links">
              <Link scroll={false} href="/terms-conditions" className="footer-link font-14">
                Terms of service
              </Link>
              <Link scroll={false} href="/privacy-policy" className="footer-link font-14">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterOne;
