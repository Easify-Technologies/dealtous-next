"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

import { useFetchUserProducts } from "@/queries/fetch-user-products";
import { useFetchCategories } from "@/queries/fetch-categories";
import { useReviewProduct } from "@/queries/actions/product-review";
import { MdOutlineCategory } from "react-icons/md";
import Preloader from "@/helper/Preloader";

const PRODUCT_STATUS = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

const Page = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const { data: products, isPending } = useFetchUserProducts(userId);
  const { data: categories } = useFetchCategories();
  const { mutate, isPending: reviewPending } = useReviewProduct();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));
  }, [categories]);

  const handleOpenModal = (product) => {
    setIsModalOpen(true);
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleReviewProduct = () => {
    mutate(
      {
        productId: selectedProduct?.id,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Product reviewed successfully");
          setTimeout(() => {
            handleCloseModal();
          }, 2000);
        },
        onError: (data) => {
          toast.error(data.error || "Product cannot be reviewd");
        },
      },
    );
  };

  useEffect(() => {
    const html = document.documentElement;

    setIsDarkMode(html.getAttribute("data-theme") === "dark");

    const observer = new MutationObserver(() => {
      const theme = html.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  if (isPending) return <Preloader />;

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">All Products</h5>
          <Link href="/user/products/add" className="btn btn-sm btn-main">
            Add Product
          </Link>
        </div>

        <span className="text-muted small">
          Total Products: {products?.length}
        </span>

        <div className="table-responsive">
          <table
            className={`table table-hover align-middle ${
              isDarkMode ? "table-dark text-white" : "table-light text-dark"
            }`}
          >
            <thead className={isDarkMode ? "table-dark" : "table-light"}>
              <tr>
                <th>S No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Currency</th>
                <th>Subscribers</th>
                <th>Language</th>
                <th>Engagement Rate</th>
                <th>Posting Frequency</th>
                <th>Monetization Methods</th>
                <th>Average Views</th>
                <th>Status</th>
                <th>Image</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {products?.length > 0 ? (
                products.map((product, index) => {
                  return (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td className="fw-medium">{product.name}</td>
                      <td>{product.price}</td>
                      <td className="text-uppercase">{product.currency}</td>
                      <td>{product.subscribers}</td>
                      <td>{product.language}</td>
                      <td>{product.engagementRate}</td>
                      <td>{product.postingFrequency}</td>
                      <td>
                        {Array.isArray(product.monetizationMethods)
                          ? product.monetizationMethods.join(", ")
                          : product.monetizationMethods || "N/A"}
                      </td>
                      <td>{product.averageViews}</td>
                      <td>
                        {product.isSold
                          ? "SOLD"
                          : PRODUCT_STATUS[product.status] || ""}
                      </td>

                      <td>
                        {product?.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="img-fluid rounded"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span className="text-muted small">No Image</span>
                        )}
                      </td>

                      <td className="text-end">
                        {product.isSold ? (
                          "No Action"
                        ) : (
                          <>
                            <Link
                              href={`/user/products/update?product_id=${product.id}`}
                              className="btn btn-sm btn-main"
                            >
                              Edit
                            </Link>
                            {product.status === "DRAFT" && (
                              <button
                                type="button"
                                className="btn btn-sm btn-success ms-2"
                                onClick={() => {
                                  handleOpenModal(product);
                                }}
                              >
                                Review
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="13" className="text-center py-4 text-muted">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedProduct && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={handleCloseModal}
          ></div>

          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div
                className="modal-content preview-modal"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-semibold">
                    {selectedProduct?.name}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body pt-2">
                  <div className="row g-4">
                    {/* LEFT: IMAGE */}
                    <div className="col-md-5">
                      <div className="preview-modal__image-wrapper">
                        <img
                          src={
                            selectedProduct?.images?.[0] || "/placeholder.png"
                          }
                          alt={selectedProduct?.name}
                          className="preview-modal__image"
                        />
                      </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="col-md-7">
                      {/* Category */}
                      {selectedProduct?.category && (
                        <span className="preview-modal__category fw-600">
                          <MdOutlineCategory size={20} className="me-1" />
                          {categoryMap[selectedProduct?.category] || ""}
                        </span>
                      )}

                      {/* Metrics */}
                      <div className="preview-modal__stats">
                        <div>
                          👥{" "}
                          {selectedProduct?.subscribers?.toLocaleString() ||
                            "N/A"}{" "}
                          subscribers
                        </div>

                        <div>
                          📈 {selectedProduct?.engagementRate || "N/A"}{" "}
                          engagement
                        </div>

                        <div>
                          📊 Avg views: {selectedProduct?.averageViews || "N/A"}
                        </div>

                        <div>
                          💰{" "}
                          {Array.isArray(selectedProduct?.monetizationMethods)
                            ? selectedProduct.monetizationMethods.join(", ")
                            : selectedProduct?.monetizationMethods || "N/A"}
                        </div>

                        <div>
                          🌍 Language: {selectedProduct?.language || "N/A"}
                        </div>
                      </div>

                      {/* Description */}
                      {selectedProduct?.summary && (
                        <p className="preview-modal__description">
                          {selectedProduct.summary}
                        </p>
                      )}

                      {/* Price + CTA */}
                      <div className="preview-modal__footer">
                        <div className="preview-modal__price">
                          {selectedProduct?.currency === "USD"
                            ? `$${selectedProduct?.price}`
                            : `₹${selectedProduct?.price}`}
                        </div>

                        <div className="">
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={handleCloseModal}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary ms-2"
                            disabled={reviewPending}
                            onClick={handleReviewProduct}
                          >
                            {reviewPending ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
