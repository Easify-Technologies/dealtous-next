import Link from "next/link";

const Blog = () => {
  return (
    <section className="blog padding-y-120 section-bg position-relative z-index-1 overflow-hidden">
      <img
        src="assets/images/shapes/pattern-five.png"
        className="position-absolute end-0 top-0 z-index--1"
        alt=""
      />
      <div className="container container-two">
        <div className="row gy-4">
          <div className="col-lg-4 col-sm-6">
            <div className="post-item">
              <div className="post-item__thumb">
                <Link scroll={false} href="/blog-details" className="link">
                  <img
                    src="assets/images/blogs/407070-PD1IM8-874-e1753799846486.jpg"
                    className="cover-img"
                    alt=""
                  />
                </Link>
              </div>
              <div className="post-item__content">
                <h5 className="post-item__title">
                  <Link scroll={false} href="/blog-details" className="link">
                    How to Buy a Telegram Channel in 2025: Step-by-Step Guide
                  </Link>
                </h5>
                <Link
                  scroll={false}
                  href="/blog-details"
                  className="btn btn-outline-light pill fw-600"
                >
                  Read More{" "}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="post-item">
              <div className="post-item__thumb">
                <Link scroll={false} href="/blog-details" className="link">
                  <img
                    src="assets/images/blogs/140396-OT1DHP-284-e1753800506314.jpg"
                    className="cover-img"
                    alt=""
                  />
                </Link>
              </div>
              <div className="post-item__content">
                <h5 className="post-item__title">
                  <Link scroll={false} href="/blog-details" className="link">
                    How to Safely Sell Your Telegram Channel or Social Account in 2025
                  </Link>
                </h5>
                <Link
                  scroll={false}
                  href="/blog-details"
                  className="btn btn-outline-light pill fw-600"
                >
                  Read More{" "}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="post-item">
              <div className="post-item__thumb">
                <Link scroll={false} href="/blog-details" className="link">
                  <img
                    src="assets/images/blogs/6633383-1024x1024.jpg"
                    className="cover-img"
                    alt=""
                  />
                </Link>
              </div>
              <div className="post-item__content">
                <h5 className="post-item__title">
                  <Link scroll={false} href="/blog-details" className="link">
                    Top Marketplaces to Buy & Sell Telegram Channels in 2025 — Dealtous Ranks #1
                  </Link>
                </h5>
                <Link
                  scroll={false}
                  href="/blog-details"
                  className="btn btn-outline-light pill fw-600"
                >
                  Read More{" "}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="post-item">
              <div className="post-item__thumb">
                <Link scroll={false} href="/blog-details" className="link">
                  <img
                    src="assets/images/blogs/3838043-1024x1024.jpg"
                    className="cover-img"
                    alt=""
                  />
                </Link>
              </div>
              <div className="post-item__content">
                <h5 className="post-item__title">
                  <Link scroll={false} href="/blog-details" className="link">
                    Avoiding Scams: How to Buy or Sell Telegram Channels Safely in 2025
                  </Link>
                </h5>
                <Link
                  scroll={false}
                  href="/blog-details"
                  className="btn btn-outline-light pill fw-600"
                >
                  Read More{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Pagination Start */}
        <nav aria-label="Page navigation example">
          <ul className="pagination common-pagination">
            <li className="page-item">
              <Link scroll={false} className="page-link" href="#">
                1
              </Link>
            </li>
            <li className="page-item">
              <Link scroll={false} className="page-link" href="#">
                2
              </Link>
            </li>
            <li className="page-item">
              <Link scroll={false} className="page-link" href="#">
                3
              </Link>
            </li>
            <li className="page-item">
              <Link scroll={false} className="page-link" href="#">
                4
              </Link>
            </li>
            <li className="page-item">
              <Link scroll={false} className="page-link" href="#">
                5
              </Link>
            </li>
            <li className="page-item">
              <Link
                scroll={false}
                className="page-link flx-align gap-2 flex-nowrap"
                href="#"
              >
                Next
                <span className="icon line-height-1 font-20">
                  <i className="las la-arrow-right" />
                </span>
              </Link>
            </li>
          </ul>
        </nav>
        {/* Pagination End */}
      </div>
    </section>
  );
};

export default Blog;
