"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useFetchCategories } from "@/queries/fetch-categories";
import { useFetchTotalSales } from "@/queries/total-sales";

import Preloader from "@/helper/Preloader";
import { FaEye } from "react-icons/fa6";
import ProductStatsModal from "./ProductStatsModal";

const AdminSales = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: sales, isLoading } = useFetchTotalSales();
  const { data: categories } = useFetchCategories();

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const categoryMap = useMemo(() => {
    if (!categories) return {};

    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

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

  if (isLoading) return <Preloader />;

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
          <h5 className="mb-0">All Sales</h5>
        </div>

        <span className="text-muted small">Total Sales: {sales?.length}</span>

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
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {sales?.length > 0 ? (
                sales?.map((product, index) => {
                  return (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{categoryMap[product.category]}</td>
                      <td>${product.price}</td>
                      <td>
                        <button
                          type="button"
                          title="View Details"
                          className="btn btn-sm btn-primary"
                          onClick={() => handleOpenModal(product)}
                        >
                          <FaEye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No Sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductStatsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </>
  );
};

export default AdminSales;
