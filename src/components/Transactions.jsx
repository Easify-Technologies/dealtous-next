"use client";

import React, { useState, useEffect, useMemo } from "react";

import ProductStatsModal from "./ProductStatsModal";
import Preloader from "@/helper/Preloader";
import { FaEye } from "react-icons/fa";
import { MdOutlineNewReleases } from "react-icons/md";
import { TbCapture } from "react-icons/tb";
import { BsCheckCircleFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

import { useOrderTransactions } from "@/queries/transactions";
import { useCapturePayment } from "@/queries/capture-payment";
import { useReleaseFunds } from "@/queries/release-funds";

const Transactions = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [verifyCaptureId, setVerifyCaptureId] = useState(null);
  const [verifyReleaseId, setVerifyReleaseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const [filter, setFilter] = useState({
    status: "",
    timeRange: "",
  });

  const { status, timeRange } = filter;

  const { data: transactions, isPending } = useOrderTransactions();
  const { mutate: capturePayment, isPending: isCapturePending } =
    useCapturePayment();
  const { mutate: releaseFunds, isPending: isReleasePending } =
    useReleaseFunds();

  const handleCapturePayment = (orderId) => {
    setVerifyCaptureId(orderId);

    capturePayment(orderId, {
      onSettled: () => {
        setVerifyCaptureId(null);
      },
    });
  };

  const handleReleaseFunds = (orderId) => {
    setVerifyReleaseId(orderId);

    releaseFunds(orderId, {
      onSettled: () => {
        setVerifyReleaseId(null);
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredOrders = useMemo(() => {
    if (!transactions) return [];

    return transactions?.filter((order) => {
      const matchedStatus = status ? order.status === status : true;
      const orderDate = new Date(order.createdAt);
      const now = new Date();

      let matchedTimeRange = true;

      if (timeRange === "24hr") {
        matchedTimeRange = now - orderDate <= 24 * 60 * 60 * 1000;
      } else if (timeRange === "7d") {
        matchedTimeRange = now - orderDate <= 7 * 24 * 60 * 60 * 1000;
      } else if (timeRange === "30d") {
        matchedTimeRange = now - orderDate <= 30 * 24 * 60 * 60 * 1000;
      }

      return matchedStatus && matchedTimeRange;
    });
  }, [transactions, status, timeRange]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [timeRange, status]);

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
          <h5 className="mb-0">All Transaction Orders</h5>
          <div className="d-flex align-items-center gap-2">
            <select
              name="status"
              id="status"
              className="form-select"
              value={status}
              onChange={handleInputChange}
            >
              <option value="">All Status</option>
              <option value="PAYMENT_AUTHORIZED">PAYMENT_AUTHORIZED</option>
              <option value="BUYER_CONFIRMED">BUYER_CONFIRMED</option>
              <option value="SELLER_TRANSFER_PENDING">
                SELLER_TRANSFER_PENDING
              </option>
              <option value="RELEASE_READY">RELEASE_READY</option>
              <option value="RELEASED">RELEASED</option>
            </select>
            <select
              name="timeRange"
              id="timeRange"
              className="form-select"
              value={timeRange}
              onChange={handleInputChange}
            >
              <option value="">All Time</option>
              <option value="24hr">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        <span className="text-muted small">
          Total Transactions: {transactions?.length}
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
                <th>Product Name</th>
                <th>Buyer Name</th>
                <th>Seller Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payout Status</th>
                <th>Payment Method</th>
                <th>Order Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentOrders?.length > 0 ? (
                currentOrders.map((order, index) => {
                  const isCapturing =
                    verifyCaptureId === order.id && isCapturePending;
                  const isReleasing =
                    verifyReleaseId === order.id && isReleasePending;

                  return (
                    <tr key={order.id}>
                      <td>{indexOfFirstOrder + index + 1}</td>
                      <td>{order.product?.name || "Unknown"}</td>
                      <td>{order.buyer?.name || "Unknown"}</td>
                      <td>{order.seller?.name || "Unknown"}</td>
                      <td>${order.amount}</td>
                      <td>{order.status}</td>
                      <td>{order.payoutStatus}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          type="button"
                          title="View Details"
                          className="action-btn btn-primary-custom"
                          onClick={() => {
                            setSelectedProduct(order.product);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEye size={18} />
                        </button>
                        {order.status === "BUYER_CONFIRMED" && (
                          <button
                            disabled={isCapturing}
                            onClick={() => handleCapturePayment(order.id)}
                            type="button"
                            title={
                              isCapturing
                                ? "Processing..."
                                : "Capture Payment"
                            }
                            className="action-btn btn-success-custom"
                          >
                            {isCapturing ? (
                              <ImSpinner2 className="spin" size={20} />
                            ) : (
                              <TbCapture size={20} />
                            )}
                          </button>
                        )}
                        {order.status === "RELEASE_READY" && (
                          <button
                            disabled={isReleasing}
                            onClick={() => handleReleaseFunds(order.id)}
                            type="button"
                            title={
                              isCapturing
                                ? "Releasing..."
                                : "Release Payment"
                            }
                            className="action-btn btn-secondary-custom"
                          >
                            {isReleasing ? (
                              <ImSpinner2 className="spin" size={20} />
                            ) : (
                              <MdOutlineNewReleases size={20} />
                            )}
                          </button>
                        )}
                        {order.status === "RELEASED" &&
                          order.payoutStatus === "PAID" && (
                            <button
                              type="button"
                              title="Paid"
                              className="action-btn btn-paid-custom"
                            >
                              <BsCheckCircleFill size={20} />
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-muted">
                    No Orders found.
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

export default Transactions;
