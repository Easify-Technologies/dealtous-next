"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useFetchCategories } from "@/queries/fetch-categories";

const ProductStatsModal = ({ isOpen, onClose, product }) => {
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
          <h5 className="mb-0">{product.name}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="row">
            <div className="col-auto">
              <img src={product.images?.[0]} className="modal-image" />
            </div>

            <div className="col">
              <div className="row mb-2">
                <div className="col">
                  <strong>Name:</strong> {product.name}
                </div>
                <div className="col">
                  <strong>Category:</strong> {categoryMap[product.category]}
                </div>
              </div>

              <div className="row mb-2">
                <div className="col">
                  <strong>Price:</strong> ${product.price}
                </div>
                <div className="col">
                  <strong>Engagement:</strong> {product.engagementRate}%
                </div>
              </div>

              <div className="row mb-2">
                <div className="col">
                  <strong>Subscribers:</strong>{" "}
                  {product.subscribers?.toLocaleString()}
                </div>
                <div className="col">
                  <strong>Frequency:</strong> {product.postingFrequency}
                </div>
              </div>

              <div className="row mb-2">
                <div className="col">
                  <strong>Language:</strong> {product.language}
                </div>
                <div className="col">
                  <strong>Avg Views:</strong> {product.averageViews}
                </div>
              </div>

              <div className="row mb-2">
                <div className="col">
                  <strong>Channel Link: </strong>
                  <Link
                    href={`/product-details?product_id=${product.id}`}
                    target="_blank"
                  >
                    View Channel
                  </Link>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <strong>Approved At:</strong> {formatDate(product.approvedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer text-end">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductStatsModal;
