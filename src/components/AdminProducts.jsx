"use client";

import { useState, useEffect, useMemo } from "react";
import Preloader from "@/helper/Preloader";

import ProductStatsModal from "./ProductStatsModal";
import { useFetchProducts } from "@/queries/fetch-products";
import { useFetchCategories } from "@/queries/fetch-categories";
import { useVerifyProduct } from "@/queries/verify-product";

import { FaEye, FaTrash } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { useRemoveProduct } from "@/queries/remove-product";

const AdminProducts = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [verifyingProductId, setVerifyingProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [filters, setFilter] = useState({
    search: "",
    category: "",
    status: "",
  });

  const { search, category, status } = filters;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const { data: products, isPending } = useFetchProducts();
  const { data: categories } = useFetchCategories();
  const { mutate, isPending: verifyPending } = useVerifyProduct();
  const { mutate: removeProduct } = useRemoveProduct();

  const categoryMap = useMemo(() => {
    if (!categories) return {};

    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const getVisiblePages = () => {
    const pages = [];

    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const filteredProducts = useMemo(() => {
    if(!products) return [];

    return products?.filter((product) => {
      const matchesSeacrh = product.name.toLowerCase().includes(search.toLocaleLowerCase());
      const matchesCategory = category
        ? product.category.toString() === category
        : true;
      const matchesStatus = status
        ? product.status.toLowerCase() === status.toLocaleLowerCase()
        : true;

      return matchesSeacrh && matchesCategory && matchesStatus;
    })
  }, [products, search, category, status]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePublish = (productId) => {
    setVerifyingProductId(productId);

    mutate(
      { productId },
      {
        onSettled: () => {
          setVerifyingProductId(null);
        },
      },
    );
  };

  const handleDeleteProduct = (productId) => {
    removeProduct(productId);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, status]);

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
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
          <h5 className="mb-0">All Products</h5>
          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              type="text"
              name="search"
              value={search}
              onChange={handleInputChange}
              placeholder="Search products..."
            />
            <select
              name="category"
              id="category"
              className="form-select"
              value={category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              name="status"
              id="status"
              className="form-select"
              value={status}
              onChange={handleInputChange}
            >
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
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
                <th>Category</th>
                <th>Price</th>
                <th>Pincode</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentProducts?.length > 0 ? (
                currentProducts.map((product, index) => {
                  const isPublishing =
                    verifyPending && verifyingProductId === product.id;

                  return (
                    <tr key={product.id}>
                      <td>{indexOfFirstProduct + index + 1}</td>
                      <td className="fw-medium">{product.name}</td>
                      <td>{categoryMap[product.category] ?? "Unknown"}</td>
                      <td>${product.price}</td>
                      <td>{product.pincode}</td>
                      <td>{product.status}</td>
                      <td>
                        {product.status === "PUBLISHED" ? (
                          <button
                            type="button"
                            disabled
                            className="action-btn btn-approved"
                          >
                            ✓ Approved
                          </button>
                        ) : (
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              title="Approve Product"
                              onClick={() => handlePublish(product.id)}
                              disabled={isPublishing}
                              type="button"
                              className="action-btn btn-success-custom"
                            >
                              <MdCheckCircle size={18} />
                            </button>

                            <button
                              title="Disapprove Product"
                              type="button"
                              className="action-btn btn-danger-custom"
                            >
                              <MdCancel size={18} />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          type="button"
                          title="View Details"
                          className="action-btn btn-primary-custom"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete Product"
                          className="action-btn btn-danger-custom"
                          onClick={() => handleDeleteProduct(product?.id)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination-container">
            {/* Prev */}
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ←
            </button>

            {/* First + dots */}
            {getVisiblePages()[0] > 1 && (
              <>
                <button className="page-btn" onClick={() => setCurrentPage(1)}>
                  1
                </button>
                {getVisiblePages()[0] > 2 && <span className="dots">...</span>}
              </>
            )}

            {/* Middle Pages */}
            {getVisiblePages().map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Last + dots */}
            {getVisiblePages().slice(-1)[0] < totalPages && (
              <>
                {getVisiblePages().slice(-1)[0] < totalPages - 1 && (
                  <span className="dots">...</span>
                )}
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              →
            </button>
          </div>
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

export default AdminProducts;
