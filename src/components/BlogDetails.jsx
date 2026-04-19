"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFetchBlogById } from "@/queries/fetch-blog";
import { useFetchBlogs } from "@/queries/all-blogs";
import Preloader from "@/helper/Preloader";

import DOMPurify from "dompurify";

const BlogDetails = () => {
  const params = useSearchParams();

  const blogId = params.get("id") ?? "";

  const { data: blog, isPending } = useFetchBlogById(blogId);
  const { data: allBlogs } = useFetchBlogs();

  const publishedBlogs = allBlogs?.filter((bg) => bg.status === "Published");

  const cleanHTML = (html) => {
    if (!html) return "";

    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    let decoded = txt.value;

    decoded = decoded.replace(/href="<a[^>]*>(.*?)<\/a>"/g, 'href="$1"');

    return decoded;
  };

  const getPreviewText = (html, limit = 150) => {
    if (!html) return "";

    // Decode HTML entities
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    const decoded = txt.value;

    // Strip HTML tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = decoded;
    let text = tempDiv.textContent || tempDiv.innerText || "";

    // Trim to limit
    if (text.length > limit) {
      return text.slice(0, limit).trim() + "...";
    }

    return text;
  };

  if (isPending) return <Preloader />;

  return (
    <>
      {/* Blog Details Section */}
      <section className="blog-details padding-y-120 position-relative overflow-hidden">
        <div className="container container-two">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* blog details top Start */}
              <div className="blog-details-top mb-64">
                <div className="blog-details-top__info flx-align gap-3 mb-4">
                  <div className="blog-details-top__thumb flx-align gap-2">
                    <span className="text-heading fw-500">{blog?.author}</span>
                  </div>
                  <span className="blog-details-top__date flx-align gap-2">
                    <img src="assets/images/icons/clock.svg" alt="" />
                    {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="blog-details-top__title mb-4 text-capitalize">
                  {blog?.title}
                </h2>
              </div>
              {/* blog details top End */}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* blog details content Start */}
              <div className="blog-details-content">
                <div className="blog-details-content__thumb mb-32">
                  <img src={blog?.images?.[0]} alt={blog?.title} />
                </div>
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(cleanHTML(blog?.content)),
                  }}
                />
              </div>
              {/* blog details content End*/}
            </div>
          </div>
        </div>
      </section>

      {/* Article Section */}
      <section className="article padding-y-120 section-bg">
        <div className="container container-two">
          <div className="section-heading style-left style-flex flx-between align-items-end gap-3">
            <div className="section-heading__inner">
              <h3 className="section-heading__title">
                Browse all latest blogs and articles
              </h3>
            </div>
            <Link
              scroll={false}
              href="/blog"
              className="btn btn-outline-light btn-lg pill"
            >
              Browse All Articles
            </Link>
          </div>
          <div className="article-item-wrapper">
            {publishedBlogs?.slice(0, 3).map((blog) => (
              <div key={blog.id} className="article-item">
                <div className="article-item__inner d-flex position-relative">
                  <div className="article-item__start">
                    <div className="user-info">
                      <div className="user-info__thumb">
                        <img src="assets/images/thumbs/user-blog.png" alt="" />
                      </div>
                      <span className="user-info__text mt-2 mb-1 font-14 text-heading">
                        Posted by
                      </span>
                      <h6 className="user-info__name font-16 font-body fw-600 mb-0">
                        {blog.author}
                      </h6>
                    </div>
                  </div>
                  <div className="article-item__center d-flex align-items-center">
                    <div className="article-item__content">
                      <div className="article-item__top flx-align">
                        <span className="text-heading font-16 fw-500">
                          {new Date(blog?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <h4 className="article-item__title mb-3">
                        <Link
                          scroll={false}
                          href={`/blog-details?blog_title=${blog.title.replace(/\s+/g, "-").toLowerCase()}&id=${blog.id}`}
                          className="link"
                        >
                          {blog.title}
                        </Link>
                      </h4>
                      <p className="article-item__desc">
                        {getPreviewText(blog?.content, 150)}
                      </p>
                    </div>
                    <div className="article-item__thumb">
                      <img src={blog.images?.[0]} alt={blog.title} />
                    </div>
                  </div>
                </div>
                <div className="article-item__end flex-shrink-0">
                  <Link
                    scroll={false}
                    href={`/blog-details?blog_title=${blog.title.replace(/\s+/g, "-").toLowerCase()}&id=${blog.id}`}
                    className="btn-simple"
                  >
                    Read More
                    <span className="icon font-26">
                      <i className="las la-arrow-right" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
