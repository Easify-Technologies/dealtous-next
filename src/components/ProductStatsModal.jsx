"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useFetchCategories } from "@/queries/fetch-categories";

const ProductStatsModal = ({ isOpen, onClose, product }) => {
  const pathname = usePathname();
  const { data: categories } = useFetchCategories();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const categoryMap = useMemo(() => {
    if (!categories) return {};

    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (!isOpen || !product) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">{product.name}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="row g-4 align-items-start">
            {/* Image */}
            <div className="col-md-3 text-center">
              <img
                src={product.images?.[0]}
                className="img-fluid rounded shadow-sm"
              />
            </div>

            {/* Content */}
            <div className="col-md-9">
              <div className="row g-2">
                {/* Left Column */}
                <div className="col-md-6">
                  <p>
                    <strong>Name:</strong> {product.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p>
                    <strong>Subscribers:</strong>{" "}
                    {product.subscribers?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Language:</strong> {product.language}
                  </p>
                  <p>
                    <strong>Channel Link:</strong>{" "}
                    <Link
                      href={`/product-details?product_id=${product.id}`}
                      target="_blank"
                    >
                      View Channel
                    </Link>
                  </p>
                  {pathname === "/admin/products" && (
                    <p>
                      <strong>Seller:</strong> {product?.sellerName || "N/A"}
                    </p>
                  )}
                </div>

                {/* Right Column */}
                <div className="col-md-6">
                  <p>
                    <strong>Category:</strong> {categoryMap[product.category]}
                  </p>
                  <p>
                    <strong>Engagement:</strong> {product.engagementRate}%
                  </p>
                  <p>
                    <strong>Frequency:</strong> {product.postingFrequency}
                  </p>
                  <p>
                    <strong>Avg Views:</strong> {product.averageViews}
                  </p>
                  {pathname === "/admin/products" && (
                    <p>
                      <strong>Buyer:</strong> {product?.buyerName || "N/A"}
                    </p>
                  )}
                  <p>
                    <strong>Approved:</strong>{" "}
                    {product.approvedAt
                      ? formatDate(product.approvedAt)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductStatsModal;
