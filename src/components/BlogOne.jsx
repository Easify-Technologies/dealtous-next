"use client";

import Link from "next/link";

import { useFetchBlogs } from "@/queries/all-blogs";

const BlogOne = () => {
  const { data: allBlogs } = useFetchBlogs();

  const publishedBlogs = allBlogs?.filter((bg) => bg.status === "Published");

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
            <h3 className="section-heading__title">Latest from Blog</h3>
          </div>
          <Link
            scroll={false}
            href="/blog"
            className="btn btn-main btn-lg pill"
          >
            Browse All Articles
          </Link>
        </div>
        <div className="row gy-4">
          {publishedBlogs?.slice(0, 3).map((blog) => (
            <div key={blog.id} className="col-lg-4 col-sm-6">
              <div className="blog-card">
                <div className="blog-card__image">
                  <Link
                    scroll={false}
                    href={`/blog-details?blog_title=${blog.title
                      .replace(/\s+/g, "-")
                      .toLowerCase()}&id=${blog.id}`}
                    className="blog-link"
                  >
                    <img
                      src={blog.images?.[0]}
                      className="blog-img"
                      alt={blog.title}
                    />
                  </Link>
                </div>

                <div className="blog-card__content">
                  <h5 className="blog-card__title">
                    <Link
                      scroll={false}
                      href={`/blog-details?blog_title=${blog.title
                        .replace(/\s+/g, "-")
                        .toLowerCase()}&id=${blog.id}`}
                      className="blog-link"
                    >
                      {blog.title}
                    </Link>
                  </h5>

                  <Link
                    scroll={false}
                    href={`/blog-details?blog_title=${blog.title
                      .replace(/\s+/g, "-")
                      .toLowerCase()}&id=${blog.id}`}
                    className="blog-btn btn btn-outline-light pill fw-600"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogOne;
