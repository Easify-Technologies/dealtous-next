"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useFetchProductById } from "@/queries/single-product";
import { useFetchCategories } from "@/queries/fetch-categories";
import Preloader from "@/helper/Preloader";
import toast from "react-hot-toast";

import { MdCategory, MdPayments } from "react-icons/md";
import { FaClock, FaEye, FaGlobe, FaUsers, FaBookOpen } from "react-icons/fa";
import { GiEngagementRing } from "react-icons/gi";
import { BiSolidNotepad } from "react-icons/bi";

const ProductDetails = () => {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const router = useRouter();

  const userId = session?.user?.id ?? "";
  const productId = params.get("product_id") ?? "";

  const { data: product, isLoading } = useFetchProductById(productId);
  const { data: categories } = useFetchCategories();

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));
  }, [categories]);

  const categoryName = categoryMap[product?.category] || "";

  const handleCheckout = () => {
    if (status !== "authenticated" || !session?.user?.id) {
      toast.error("Please login to your account", {
        position: "top-center",
      });
      return;
    }

    router.push(`/checkout?productId=${product?.id}&userId=${userId}`);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (isLoading) return <Preloader />;

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
                      <span className="text">Verified</span>
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
                      <img
                        src={product?.images?.[0]}
                        alt={product?.name}
                        loading="lazy"
                        className="w-100 object-cover"
                      />
                    </div>
                    <div className="product-details__item">
                      <h5 className="product-details__title mt-4 mb-0">
                        Summary
                      </h5>
                      <p className="product-details__desc">
                        {product?.summary}
                      </p>
                    </div>
                  </div>
                  {/* Product Details Content End */}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              {/* ======================= Product Sidebar Start ========================= */}
              <div className="product-sidebar section-bg">
                <div className="product-sidebar__top position-relative flx-between gap-1">
                  <h6 className="product-sidebar__title mb-0">
                    ${product?.price}.00
                  </h6>
                </div>
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
                    <div className="d-flex align-items-center gap-2">
                      <FaClock size={15} color="#482728" />
                      <span className="name">Last Update</span>
                    </div>
                    <span className="details">
                      {formatDate(product?.updatedAt)}
                    </span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <BiSolidNotepad size={15} color="#482728" />
                      <span className="name">Published</span>
                    </div>
                    <span className="details">
                      {formatDate(product?.approvedAt)}
                    </span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <MdCategory size={15} color="#482728" />
                      <span className="name">Category</span>
                    </div>
                    <span className="details">{categoryName}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <FaGlobe size={15} color="#482728" />
                      <span className="name">Language</span>
                    </div>
                    <span className="details">{product?.language || "Unknown"}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <FaUsers size={15} color="#482728" />
                      <span className="name">Subscribers</span>
                    </div>
                    <span className="details">{product?.subscribers || "Unknown"}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <FaEye size={15} color="#482728" />
                      <span className="name">Average Views</span>
                    </div>
                    <span className="details">{product?.averageViews || "Unknown"}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <GiEngagementRing size={15} color="#482728" />
                      <span className="name">Engagement Rate</span>
                    </div>
                    <span className="details">{product?.engagementRate || "Unknown"}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <FaBookOpen size={15} color="#482728" />
                      <span className="name">Posting Frequency</span>
                    </div>
                    <span className="details">{product?.postingFrequency || "Unknown"}</span>
                  </li>
                  <li className="meta-attribute__item">
                    <div className="d-flex align-items-center gap-2">
                      <MdPayments size={15} color="#482728" />
                      <span className="name">Monetization</span>
                    </div>
                    <span className="details">
                      {product?.monetizationMethods || "Unknown"}
                    </span>
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
