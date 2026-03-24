"use client";

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

  if (!isOpen || !product) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product Statistics</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="stats-grid">
            <div className="stats-item">
              <strong>Name:</strong> {product.name}
            </div>

            <div className="stats-item">
              <strong>Price:</strong> {product.price}
            </div>

            <div className="stats-item">
              <strong>Category:</strong> {categoryMap[product.category] || "Unknown"}
            </div>

            <div className="stats-item">
              <strong>Subscribers:</strong>{" "}
              {product.subscribers?.toLocaleString()}
            </div>

            <div className="stats-item">
              <strong>Engagement:</strong> {product.engagementRate}%
            </div>

            <div className="stats-item">
              <strong>Language:</strong> {product.language}
            </div>

            <div className="stats-item">
              <strong>Frequency:</strong> {product.postingFrequency}
            </div>

            <div className="stats-item">
              <strong>Avg Views:</strong> {product.averageViews}
            </div>
          </div>

          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="modal-image"
              loading="lazy"
            />
          )}
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
