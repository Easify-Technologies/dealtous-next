import Link from "next/link";

const BreadcrumbFour = () => {
  return (
    <section className="breadcrumb breadcrumb-four padding-static-y-60 section-bg position-relative z-index-1 overflow-hidden">
      <img
        src="assets/images/gradients/breadcrumb-gradient-bg.png"
        alt=""
        className="bg--gradient"
      />
      <img
        src="assets/images/shapes/element-moon3.png"
        alt=""
        className="element one"
      />
      <img
        src="assets/images/shapes/element-moon1.png"
        alt=""
        className="element three"
      />
      <div className="container container-two">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="breadcrumb-four-content">
              <h3 className="breadcrumb-four-content__title text-center mb-3 text-capitalize">
                Checkout
              </h3>
              <ul className="breadcrumb-list flx-align justify-content-center gap-2 mb-2">
                <li className="breadcrumb-list__item font-14 text-body">
                  <Link
                    scroll={false}
                    href="/"
                    className="breadcrumb-list__link text-body hover-text-main"
                  >
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-list__item font-14 text-body">
                  <span className="breadcrumb-list__icon font-10">
                    <i className="fas fa-chevron-right" />
                  </span>
                </li>
                <li className="breadcrumb-list__item font-14 text-body">
                  <span className="breadcrumb-list__text">
                    Checkout
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreadcrumbFour;
