"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFetchProducts } from "@/queries/fetch-products";
import { useFetchCategories } from "@/queries/fetch-categories";
import { IoRibbonOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import Preloader from "@/helper/Preloader";

const ArrivalOne = () => {
  const { data: products, isLoading } = useFetchProducts();
  const { data: categories } = useFetchCategories();

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));
  }, [categories]);

  if (isLoading) return <Preloader />;

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
              {products?.slice(0, 4).map((item) => {
                const categoryName = categoryMap[item?.category] || "";

                return (
                  <div
                    key={item.id}
                    className="col-xxl-3 col-lg-4 col-sm-6 mb-4"
                  >
                    <div className="channel-card">
                      {/* Image */}
                      <div className="channel-card__media">
                        {item?.status === "PUBLISHED" && (
                          <div className="channel-card__badge">
                            <IoRibbonOutline size={16} />
                            <span>Verified</span>
                          </div>
                        )}

                        <Link href={`/product-details?product_id=${item?.id}`}>
                          <img
                            src={item.images?.[0] || "/placeholder.png"}
                            alt={item?.name}
                            className="channel-card__image"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      {/* Content */}
                      <div className="channel-card__body">
                        {/* Category */}
                        {categoryName && (
                          <span className="channel-card__category">
                            <MdOutlineCategory size={16} />
                            {categoryName}
                          </span>
                        )}

                        {/* Title */}
                        <h6 className="channel-card__title">
                          <Link
                            href={`/product-details?product_id=${item?.id}`}
                          >
                            {item?.name}
                          </Link>
                        </h6>

                        {/* Metrics */}
                        <div className="channel-card__stats">
                          <div className="channel-card__stat">
                            👥 {item?.subscribers?.toLocaleString() || "N/A"}
                          </div>

                          <div className="channel-card__stat">
                            📈 {item?.engagementRate || "N/A"}
                          </div>

                          <div className="channel-card__stat">
                            💰{" "}
                            {Array.isArray(item?.monetizationMethods)
                              ? item?.monetizationMethods[0]
                              : item?.monetizationMethods || "N/A"}
                          </div>

                          <div className="channel-card__stat">
                            📊 {item?.averageViews || "N/A"} views
                          </div>

                          <div className="channel-card__stat">
                            🌍 {item?.language || "N/A"}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="channel-card__footer">
                          <span className="channel-card__price">
                            {item?.currency === "USD"
                              ? `$${item?.price}`
                              : `₹${item?.price}`}
                          </span>

                          <Link
                            href={`/product-details?product_id=${item?.id}`}
                            className="channel-card__cta"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-center mt-64">
          <Link
            scroll={false}
            href="/all-product"
            className="btn btn-main btn-lg pill fw-300"
          >
            View All Channels
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArrivalOne;
