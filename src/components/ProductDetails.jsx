"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useFetchProductById } from "@/queries/single-product";
import { useFetchCategories } from "@/queries/fetch-categories";
import Preloader from "@/helper/Preloader";

const ProductDetails = () => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const router = useRouter();

  const userId = session?.user?.id ?? "";
  const productId = params.get("product_id") ?? "";

  const { data: product, isPending } = useFetchProductById(productId);
  const { data: categories } = useFetchCategories();

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));
  }, [categories]);

  const categoryName = categoryMap[product?.category] || "";

  const handleCheckout = () => {
    router.push(`/checkout?productId=${product?.id}&userId=${userId}`);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (isPending) return <Preloader />;

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb border-bottom p-0 d-block section-bg position-relative z-index-1">
        <div className="breadcrumb-two">
          <img
            src="assets/images/gradients/breadcrumb-gradient-bg.png"
            alt=""
            className="bg--gradient"
          />
          <div className="container container-two">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="breadcrumb-two-content">
                  <ul className="breadcrumb-list flx-align gap-2 mb-2">
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
                      <Link
                        scroll={false}
                        href="/all-product"
                        className="breadcrumb-list__link text-body hover-text-main"
                      >
                        Products
                      </Link>
                    </li>
                    <li className="breadcrumb-list__item font-14 text-body">
                      <span className="breadcrumb-list__icon font-10">
                        <i className="fas fa-chevron-right" />
                      </span>
                    </li>
                    <li className="breadcrumb-list__item font-14 text-body">
                      <span className="breadcrumb-list__text">
                        {product?.name}
                      </span>
                    </li>
                  </ul>
                  <h3 className="breadcrumb-two-content__title mb-3 text-capitalize">
                    {product?.name}
                  </h3>
                  <div className="breadcrumb-content flx-align gap-3">
                    <div className="breadcrumb-content__item text-heading fw-500 flx-align gap-2">
                      <span className="icon">
                        <img
                          src="assets/images/icons/check-icon.svg"
                          alt=""
                          className="white-version"
                        />
                        <img
                          src="assets/images/icons/check-icon-white.svg"
                          alt=""
                          className="dark-version"
                        />
                      </span>
                      <span className="text">Recently Updated</span>
                    </div>
                    <div className="breadcrumb-content__item text-heading fw-500 flx-align gap-2">
                      <span className="icon">
                        <img
                          src="assets/images/icons/check-icon.svg"
                          alt=""
                          className="white-version"
                        />
                        <img
                          src="assets/images/icons/check-icon-white.svg"
                          alt=""
                          className="dark-version"
                        />
                      </span>
                      <span className="text">Well Documented</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <div className="product-details mt-32 padding-b-120">
        <div className="container container-two">
          <div className="row gy-4">
            <div className="col-lg-8">
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-product-details"
                  role="tabpanel"
                  aria-labelledby="pills-product-details-tab"
                  tabIndex={0}
                >
                  {/* Product Details Content Start */}
                  <div className="product-details">
                    <div className="product-details__thumb">
                      <img src={product?.images?.[0]} alt={product?.name} loading="lazy" />
                    </div>
                    <div className="product-details__buttons flx-align justify-content-center gap-3">
                      <Link
                        scroll={false}
                        href="#"
                        className="btn btn-main d-inline-flex align-items-center gap-2 pill px-sm-5 justify-content-center"
                      >
                        Live Preview
                        <img src="assets/images/icons/eye-outline.svg" alt="" />
                      </Link>
                      <Link
                        scroll={false}
                        href="#"
                        className="screenshot-btn btn btn-white pill px-sm-5"
                        data-images={product?.images?.[0]}
                      >
                        Screenshot
                      </Link>
                    </div>
                    <div className="product-details__item">
                      <h5 className="product-details__title mt-4">Summary</h5>
                      <p className="product-details__desc">
                        {product?.summary}
                      </p>
                    </div>
                  </div>
                  {/* Product Details Content End */}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-rating"
                  role="tabpanel"
                  aria-labelledby="pills-rating-tab"
                  tabIndex={0}
                >
                  <div className="product-review-wrapper">
                    <div className="product-review">
                      <div className="product-review__top flx-between">
                        <div className="product-review__rating flx-align">
                          <div className="d-flex align-items-center gap-1">
                            <ul className="star-rating">
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                            </ul>
                            <span className="star-rating__text text-body">
                              {" "}
                              5.0
                            </span>
                          </div>
                          <span className="product-review__reason">
                            For{" "}
                            <span className="product-review__subject">
                              Customer Support
                            </span>{" "}
                          </span>
                        </div>
                        <div className="product-review__date">
                          by{" "}
                          <Link
                            scroll={false}
                            href="#"
                            className="product-review__user text--base"
                          >
                            John Doe{" "}
                          </Link>{" "}
                          2 month ago
                        </div>
                      </div>
                      <div className="product-review__body">
                        <p className="product-review__desc">
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit. Quibusdam itaque vitae ex possimus delectus?
                          Voluptas expedita accusantium aperiam quo quod dolore
                          dignissimos rerum praesentium deserunt libero
                          recusandae quisquam est accusamus eos dolorum sit
                          explicabo, sapiente pariatur voluptates veniam aut
                          veritatis, magnam velit similique! Ex similique magni
                          labore aperiam, eius quas molestiae accusantium porro
                          eaque esse minus amet doloribus quo odit illo
                          doloremque.
                        </p>
                      </div>
                    </div>
                    <div className="product-review">
                      <div className="product-review__top flx-between">
                        <div className="product-review__rating flx-align">
                          <div className="d-flex align-items-center gap-1">
                            <ul className="star-rating">
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                              <li className="star-rating__item font-11">
                                <i className="fas fa-star" />
                              </li>
                            </ul>
                            <span className="star-rating__text text-body">
                              {" "}
                              5.0
                            </span>
                          </div>
                          <span className="product-review__reason">
                            For{" "}
                            <span className="product-review__subject">
                              Customer Support
                            </span>{" "}
                          </span>
                        </div>
                        <div className="product-review__date">
                          by{" "}
                          <Link
                            scroll={false}
                            href="#"
                            className="product-review__user text--base"
                          >
                            John Doe{" "}
                          </Link>{" "}
                          2 month ago
                        </div>
                      </div>
                      <div className="product-review__body">
                        <p className="product-review__desc">
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit. Quibusdam itaque vitae ex possimus delectus?
                          Voluptas expedita accusantium aperiam quo quod dolore
                          dignissimos rerum praesentium deserunt libero
                          recusandae quisquam est accusamus eos dolorum sit
                          explicabo, sapiente pariatur voluptates veniam aut
                          veritatis, magnam velit similique! Ex similique magni
                          labore aperiam, eius quas molestiae accusantium porro
                          eaque esse minus amet doloribus quo odit illo
                          doloremque.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-comments"
                  role="tabpanel"
                  aria-labelledby="pills-comments-tab"
                  tabIndex={0}
                >
                  {/* Comment Start */}
                  <div className="comment mt-64 mb-64">
                    <h5 className="mb-32">2 Comments</h5>
                    <ul className="comment-list">
                      <li className="comment-list__item d-flex align-items-start gap-sm-4 gap-3">
                        <div className="comment-list__thumb flex-shrink-0">
                          <img
                            src="assets/images/thumbs/comment1.png"
                            className="cover-img"
                            alt=""
                          />
                        </div>
                        <div className="comment-list__content">
                          <div className="flx-between gap-2 align-items-start">
                            <div>
                              <h6 className="comment-list__name font-18 mb-sm-2 mb-1">
                                Jenny Wilson
                              </h6>
                              <span className="comment-list__date font-14">
                                Jan 21, 2024 at 11:25 pm
                              </span>
                            </div>
                            <Link
                              scroll={false}
                              className="comment-list__reply fw-500 flx-align gap-2 hover-text-decoration-underline"
                              href="#comment-box"
                            >
                              Reply
                              <span className="icon">
                                <img
                                  src="assets/images/icons/reply-icon.svg"
                                  alt=""
                                />
                              </span>
                            </Link>
                          </div>
                          <p className="comment-list__desc mt-3">
                            Lorem ipsum dolor sit amet consectetur. Nec nunc
                            pellentesque massa pretium. Quam sapien nec
                            venenatis vivamus sed cras faucibus mi viverra. Quam
                            faucibus morbi cras vitae neque. Necnunc
                            pellentesque massa pretium.
                          </p>
                        </div>
                      </li>
                      <li>
                        <ul className="comment-list comment-list--two">
                          <li className="comment-list__item d-flex align-items-start gap-sm-4 gap-3">
                            <div className="comment-list__thumb flex-shrink-0">
                              <img
                                src="assets/images/thumbs/comment2.png"
                                className="cover-img"
                                alt=""
                              />
                            </div>
                            <div className="comment-list__content">
                              <div className="flx-between gap-2 align-items-start">
                                <div>
                                  <h6 className="comment-list__name font-18 mb-sm-2 mb-1">
                                    Courtney Henry
                                  </h6>
                                  <span className="comment-list__date font-14">
                                    Jan 21, 2024 at 11:25 pm
                                  </span>
                                </div>
                                <Link
                                  scroll={false}
                                  className="comment-list__reply fw-500 flx-align gap-2 hover-text-decoration-underline"
                                  href="#comment-box"
                                >
                                  Reply
                                  <span className="icon">
                                    <img
                                      src="assets/images/icons/reply-icon.svg"
                                      alt=""
                                    />
                                  </span>
                                </Link>
                              </div>
                              <p className="comment-list__desc mt-3">
                                Lorem ipsum dolor sit amet consectetur. Nec nunc
                                pellentesque massa pretium. Quam sapien nec
                                venenatis vivamus sed cras faucibus.
                              </p>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  {/* Comment End */}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              {/* ======================= Product Sidebar Start ========================= */}
              <div className="product-sidebar section-bg">
                <div className="product-sidebar__top position-relative flx-between gap-1">
                  <button
                    type="button"
                    className="btn-has-dropdown font-heading font-18"
                  >
                    Extended License
                  </button>
                  <div className="license-dropdown">
                    <div className="license-dropdown__item mb-3">
                      <h6 className="license-dropdown__title font-body mb-1 font-16">
                        Regular License
                      </h6>
                      <p className="license-dropdown__desc font-13">
                        Use, by you or one client, in a solitary finished result
                        which end clients are not charged for. The complete cost
                        incorporates the thing cost and a purchaser expense..
                      </p>
                    </div>
                    <div className="license-dropdown__item">
                      <h6 className="license-dropdown__title font-body mb-1 font-16">
                        Extended License
                      </h6>
                      <p className="license-dropdown__desc font-13">
                        Use, by you or one client, in a solitary final result
                        which end clients can be charged for. The all out cost
                        incorporates the thing cost and a purchaser expense.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-top text-center ">
                      <Link
                        scroll={false}
                        href="#"
                        className="link hover-text-decoration-underline font-14 text-main fw-500"
                      >
                        View License Details
                      </Link>
                    </div>
                  </div>
                  <h6 className="product-sidebar__title">
                    ${product?.price}.00
                  </h6>
                </div>
                <ul className="sidebar-list">
                  <li className="sidebar-list__item flx-align gap-2 font-14 fw-300 mb-2">
                    <span className="icon">
                      <img src="assets/images/icons/check-cirlce.svg" alt="" />
                    </span>
                    <span className="text">Quality verified</span>
                  </li>
                  <li className="sidebar-list__item flx-align gap-2 font-14 fw-300 mb-2">
                    <span className="icon">
                      <img src="assets/images/icons/check-cirlce.svg" alt="" />
                    </span>
                    <span className="text">Use for a single project</span>
                  </li>
                  <li className="sidebar-list__item flx-align gap-2 font-14 fw-300">
                    <span className="icon">
                      <img src="assets/images/icons/check-cirlce.svg" alt="" />
                    </span>
                    <span className="text">Non-paying users only</span>
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn btn-main d-flex w-100 justify-content-center align-items-center gap-2 pill px-sm-5 mt-32"
                >
                  <img src="assets/images/icons/add-to-cart.svg" alt="" />
                  Proceed to Checkout
                </button>
                {/* Meta Attribute List Start */}
                <ul className="meta-attribute">
                  <li className="meta-attribute__item">
                    <span className="name">Last Update</span>
                    <span className="details">
                      {formatDate(product?.updatedAt)}
                    </span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Published</span>
                    <span className="details">
                      {formatDate(product?.approvedAt)}
                    </span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Category</span>
                    <span className="details">{categoryName}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Language</span>
                    <span className="details">{product?.language}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Subscribers</span>
                    <span className="details">{product?.subscribers}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Average Views</span>
                    <span className="details">{product?.averageViews}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Engagement Rate</span>
                    <span className="details">{product?.engagementRate}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Posting Frequency</span>
                    <span className="details">
                      {product?.postingFrequency}
                    </span>
                  </li>
                  <li className="meta-attribute__item">
                    <span className="name">Monetization Methods</span>
                    <span className="details">{product?.monetizationMethods}</span>
                  </li>
                </ul>
                {/* Meta Attribute List End */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
