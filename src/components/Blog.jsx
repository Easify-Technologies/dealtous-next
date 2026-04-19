"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFetchBlogs } from "@/queries/all-blogs";

import Preloader from "@/helper/Preloader";

const Blog = () => {
  const { data: blogs, isLoading } = useFetchBlogs();

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const publishedBlogs = blogs?.filter((bg) => bg.status === "Published");

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const currentBlogs = publishedBlogs?.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil((blogs?.length || 0) / blogsPerPage);

  const getVisiblePages = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [blogs]);

  if (isLoading) return <Preloader />;

  return (
    <section className="blog padding-y-120 section-bg position-relative z-index-1 overflow-hidden">
      <img
        src="assets/images/shapes/pattern-five.png"
        className="position-absolute end-0 top-0 z-index--1"
        alt=""
      />
      <div className="container container-two">
        <div className="row gy-4">
          {currentBlogs?.map((blog) => (
            <div key={blog.id} className="col-lg-4 col-sm-6">
              <div className="post-item">
                <div className="post-item__thumb">
                  <Link
                    scroll={false}
                    href={`/blog-details?blog_title=${blog.title.replace(/\s+/g, "-").toLowerCase()}&id=${blog.id}`}
                    className="link"
                  >
                    <div className="image-wrapper">
                      <img
                        src={blog.images?.[0]}
                        alt={blog.title}
                        loading="lazy"
                      />
                    </div>
                  </Link>
                </div>
                <div className="post-item__content">
                  <h5 className="post-item__title">
                    <Link
                      scroll={false}
                      href={`/blog-details?blog_title=${blog.title.replace(/\s+/g, "-").toLowerCase()}&id=${blog.id}`}
                      className="link"
                    >
                      {blog.title}
                    </Link>
                  </h5>
                  <Link
                    scroll={false}
                    href={`/blog-details?blog_title=${blog.title.replace(/\s+/g, "-").toLowerCase()}&id=${blog.id}`}
                    className="btn btn-outline-light pill fw-600"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Start */}
        {currentBlogs?.length > 0 && (
          <nav className="pagination-wrapper">
            <ul className="pagination-custom">
              {/* Prev */}
              <li>
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ←
                </button>
              </li>

              {/* Page Numbers */}
              {getVisiblePages().map((page) => (
                <li key={page}>
                  <button
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              {/* Next */}
              <li>
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  →
                </button>
              </li>
            </ul>
          </nav>
        )}
        {/* Pagination End */}
      </div>
    </section>
  );
};

export default Blog;
