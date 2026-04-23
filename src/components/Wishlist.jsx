"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

import { useFetchCategories } from "@/queries/fetch-categories";
import { FaRegHeart } from "react-icons/fa";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { data: categories } = useFetchCategories();

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));
  }, [categories]);

  return (
    <>
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
                  Wishlist
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
                    <span className="breadcrumb-list__text">Wishlist</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cart padding-y-120">
        <div className="container">
          <div className="cart-content">
            {wishlist?.length > 0 ? (
              <>
                <div className="table-responsive">
                  <table className="table style-two">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlist?.map((item) => {
                        const categoryName = categoryMap[item?.category] || "";

                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="cart-item">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="cart-item__thumb">
                                    <Link
                                      scroll={false}
                                      href={`/product-details?product_id=${item.id}`}
                                      className="link"
                                    >
                                      <img
                                        src={item.images?.[0]}
                                        alt={item.name}
                                        className="cover-img"
                                      />
                                    </Link>
                                  </div>
                                  <div className="cart-item__content">
                                    <h6 className="cart-item__title font-heading fw-700 text-capitalize font-18 mb-4">
                                      {" "}
                                      <Link
                                        scroll={false}
                                        href={`/product-details?product_id=${item.id}`}
                                        className="link"
                                      >
                                        {item.name}
                                      </Link>
                                    </h6>
                                    <span className="cart-item__price font-16 text-heading fw-500">
                                      Category:{" "}
                                      <span className="text-body font-14">
                                        {categoryName}
                                      </span>
                                    </span>
                                    <br />
                                    <span className="cart-item__price font-16 text-heading fw-500">
                                      Subscribers:{" "}
                                      <span className="text-body font-14">
                                        {item.subscribers}
                                      </span>
                                    </span>
                                    <br />
                                    <span className="cart-item__price font-16 text-heading fw-500">
                                      Average Views:{" "}
                                      <span className="text-body font-14">
                                        {item.averageViews}
                                      </span>
                                    </span>
                                    <br />
                                    <span className="cart-item__price font-16 text-heading fw-500">
                                      Engagement:{" "}
                                      <span className="text-body font-14">
                                        {item.engagementRate}
                                      </span>
                                    </span>
                                    <br />
                                    <span className="cart-item__price cart-frequency-price font-16 text-heading fw-500">
                                      Posting Frequency:{" "}
                                      <span className="text-body font-14">
                                        {item.postingFrequency}
                                      </span>
                                    </span>
                                    <br />
                                    <span className="cart-item__price font-16 text-heading fw-500">
                                      Monetization:{" "}
                                      <span className="text-body font-14">
                                        {Array.isArray(item.monetizationMethods)
                                          ? item.monetizationMethods.join(", ")
                                          : item.monetizationMethods ||
                                            "Unknown"}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div className="flx-align gap-4 mt-3 mt-lg-4">
                                  <button
                                    type="button"
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="rounded-btn delete-btn text-danger hover-text-decoration-underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="cart-item__totalPrice text-body font-18 fw-400 mb-0">
                                ${item.price}
                              </span>
                            </td>
                            <td>
                              <span className="cart-item__totalPrice text-body font-18 fw-400 mb-0">
                                ${item.price}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="cart-content__bottom flx-between gap-2">
                  <Link
                    scroll={false}
                    href="/all-product"
                    className="btn btn-outline-light flx-align gap-2 pill btn-lg"
                  >
                    <span className="icon line-height-1 font-20">
                      <i className="las la-arrow-left" />
                    </span>
                    Continue Shopping
                  </Link>
                </div>
              </>
            ) : (
              <div className="card border-0 shadow-sm text-center empty-cart-card">
                <div className="card-body py-5">
                  <div className="mb-3">
                    <FaRegHeart size={50} className="empty-cart-icon"/>
                  </div>

                  <h5 className="fw-semibold mb-2">Your wishlist is empty</h5>

                  <p className="text-muted mb-4">
                    Looks like you haven’t added any channels yet. Explore
                    listings and find the perfect one to get started.
                  </p>

                  <Link
                    href="/all-product"
                    type="button"
                    className="btn btn-main px-4 pill"
                  >
                    Browse Channels
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
