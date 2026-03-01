import Link from "next/link";

const BlogOne = () => {
  return (
    <section className="blog padding-y-120 section-bg position-relative z-index-1 overflow-hidden">
      <img
        src="assets/images/shapes/pattern-five.png"
        className="position-absolute end-0 top-0 z-index--1"
        alt=""
      />
      <div className="container container-two">
        <div className="section-heading style-left style-flex flx-between align-items-end gap-3">
          <div className="section-heading__inner">
            <h3 className="section-heading__title">
              Latest from Blog
            </h3>
          </div>
          <Link scroll={false} href="/blog" className="btn btn-main btn-lg pill">
            Browse All Articles
          </Link>
        </div>
        <div className="row gy-4">
          <div className="col-lg-4 col-sm-6">
            <div className="post-item">
              <div className="post-item__thumb">
                <Link scroll={false} href="/blog-details" className="link">
                  <img
                    src="assets/images/blogs/10172884-1024x1024.jpg"
                    className="cover-img"
                    alt=""
                  />
                </Link>
              </div>
              <div className="post-item__content">
                <h5 className="post-item__title">
                  <Link scroll={false} href="/blog-details" className="link">
                    Telegram Channel Valuation 2025: How Much Is Your Channel…
                  </Link>
                </h5>
                <Link scroll={false}
                  href="/blog-details"
                  className="btn btn-outline-light pill fw-600"
                >
                  Read More
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
                    Avoiding Scams: How to Buy or Sell Telegram Channels…
                  </Link>
                </h5>
                <Link scroll={false}
                  href="/blog-details"
                  className="btn btn-outline-light pill fw-600"
                >
                  Read More
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
                    Top Marketplaces to Buy & Sell Telegram Channels in…
                  </Link>
                </h5>
                <Link scroll={false}
                  href="/blog-details"
                  className="btn btn-outline-light pill fw-600"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogOne;
