"use client";

import { useState, useEffect, useMemo } from "react";
import Preloader from "@/helper/Preloader";

import toast from "react-hot-toast";
import { useFetchProducts } from "@/queries/fetch-products";
import { useFetchCategories } from "@/queries/fetch-categories";
import { useVerifyProduct } from "@/queries/verify-product";
import { useRejectProduct } from "@/queries/reject-product";

import { FaEye, FaTrash, FaPencilAlt } from "react-icons/fa";
import { useRemoveProduct } from "@/queries/remove-product";
import UpdateProductModal from "./UpdateProductModal";

const PRODUCT_STATUS = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
};

const AdminProducts = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [filters, setFilter] = useState({
    search: "",
    category: "",
    status: "",
  });

  const { search, category, status } = filters;

  const handleOpenModal = (type, product) => {
    setSelectedProduct(product);
    setTimeout(() => setActiveModal(type), 100);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const { data: products, isPending } = useFetchProducts();
  const { data: categories } = useFetchCategories();
  const { mutate, isPending: verifyPending } = useVerifyProduct();
  const { mutate: rejectProduct, isPending: rejectPending } =
    useRejectProduct();
  const { mutate: removeProduct, isPending: removePending } =
    useRemoveProduct();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
    if (!products) return [];

    return products?.filter((product) => {
      const matchesSeacrh = product.name
        .toLowerCase()
        .includes(search.toLocaleLowerCase());
      const matchesCategory = category
        ? product.category.toString() === category
        : true;
      const matchesStatus = status
        ? product.status.toLowerCase() === status.toLocaleLowerCase()
        : true;

      return matchesSeacrh && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const handlePublish = (productId) => {
    mutate(
      { productId },
      {
        onSuccess: () => {
          toast.success("Product approved successfully.");
          setTimeout(() => {
            closeModal();
          }, 2000);
        },
        onError: () => {
          toast.error("Failed to approve product.");
        },
      },
    );
  };

  const handleReject = (productId) => {
    rejectProduct(
      { productId },
      {
        onSuccess: () => {
          toast.success("Product rejected successfully.");
          setTimeout(() => {
            closeModal();
          }, 2000);
        },
        onError: () => {
          toast.error("Failed to reject product.");
        },
      },
    );
  };

  const handleConfirmDeleteProduct = () => {
    if (!selectedProduct) return;

    removeProduct(selectedProduct?.id, {
      onSuccess: () => {
        toast.success("Product deleted successfully.");
        setTimeout(() => {
          closeModal();
        }, 2000);
      },
      onError: () => {
        toast.error("Failed to delete product. Please try again.");
      },
    });
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
              <option value="pending_review">Pending Review</option>
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentProducts?.length > 0 ? (
                currentProducts.map((product, index) => {
                  return (
                    <tr key={product.id}>
                      <td>{indexOfFirstProduct + index + 1}</td>
                      <td className="fw-medium">{product.name}</td>
                      <td>{categoryMap[product.category] ?? "Unknown"}</td>
                      <td>${product.price}</td>
                      <td>{product.pincode}</td>
                      <td>{PRODUCT_STATUS[product.status]}</td>
                      <td className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          type="button"
                          title="View Details"
                          className="action-btn btn-primary-custom"
                          onClick={() => handleOpenModal("view", product)}
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          type="button"
                          title="Edit Product"
                          className="action-btn btn-info-custom"
                          onClick={() => handleOpenModal("edit", product)}
                        >
                          <FaPencilAlt size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete Product"
                          className="action-btn btn-danger-custom"
                          onClick={() => handleOpenModal("delete", product)}
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

      {/* Product Details Modal */}
      {activeModal === "view" && selectedProduct && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "view" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${activeModal === "view" ? "show d-block" : "d-block"}`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    {selectedProduct?.name}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <div className="row g-4 align-items-start">
                    {/* Image */}
                    <div className="col-md-3 text-center">
                      <img
                        src={selectedProduct?.images?.[0]}
                        className="img-fluid rounded shadow-sm"
                        alt={selectedProduct?.name}
                      />
                    </div>

                    {/* Content */}
                    <div className="col-md-9">
                      <div className="row g-2">
                        {/* Left */}
                        <div className="col-md-6">
                          <p>
                            <strong>Name:</strong> {selectedProduct?.name}
                          </p>
                          <p>
                            <strong>Price:</strong> ${selectedProduct?.price}
                          </p>
                          <p>
                            <strong>Subscribers:</strong>{" "}
                            {selectedProduct?.subscribers?.toLocaleString()}
                          </p>
                          <p>
                            <strong>Language:</strong>{" "}
                            {selectedProduct?.language}
                          </p>

                          <p>
                            <strong>Channel Link:</strong>{" "}
                            <a
                              href={`/product-details?product_id=${selectedProduct?.id}`}
                              target="_blank"
                            >
                              View Channel
                            </a>
                          </p>
                          <p>
                            <strong>Seller:</strong>{" "}
                            {selectedProduct?.sellerName || "N/A"}
                          </p>
                          <p>
                            <strong>Buyer:</strong>{" "}
                            {selectedProduct?.buyerName || "N/A"}
                          </p>
                        </div>

                        {/* Right */}
                        <div className="col-md-6">
                          <p>
                            <strong>Category:</strong>{" "}
                            {categoryMap[selectedProduct?.category]}
                          </p>
                          <p>
                            <strong>Engagement:</strong>{" "}
                            {selectedProduct?.engagementRate}
                          </p>
                          <p>
                            <strong>Frequency:</strong>{" "}
                            {selectedProduct?.postingFrequency}
                          </p>
                          <p>
                            <strong>Avg Views:</strong>{" "}
                            {selectedProduct?.averageViews}
                          </p>
                          <p>
                            <strong>Monetization Methods:</strong>{" "}
                            {Array.isArray(selectedProduct?.monetizationMethods)
                              ? selectedProduct?.monetizationMethods.join(", ")
                              : selectedProduct?.monetizationMethods || "N/A"}
                          </p>
                          <p>
                            <strong>Approved:</strong>{" "}
                            {selectedProduct?.approvedAt
                              ? formatDate(selectedProduct?.approvedAt)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  {selectedProduct?.status === "PENDING_REVIEW" && (
                    <div className="d-flex align-items-center gap-2 me-auto">
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => handlePublish(selectedProduct?.id)}
                        disabled={verifyPending}
                      >
                        {verifyPending ? "Approving..." : "Approve"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(selectedProduct?.id)}
                        disabled={rejectPending}
                      >
                        {rejectPending ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  )}

                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Product Modal */}
      {activeModal === "edit" && selectedProduct && (
        <>
          <UpdateProductModal
            activeModal={activeModal}
            closeModal={closeModal}
            selectedProduct={selectedProduct}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === "delete" && selectedProduct && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "delete" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${
              activeModal === "delete" ? "show d-block" : "d-block"
            }`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    Delete this product permanently?
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <p className="mb-2">
                    You are about to delete{" "}
                    <strong>{selectedProduct?.name}</strong>.
                  </p>

                  <p className="mb-0 text-muted small">
                    This action cannot be undone. All related product details
                    and listing data will be removed permanently.
                  </p>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmDeleteProduct}
                    disabled={removePending}
                  >
                    {removePending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminProducts;
