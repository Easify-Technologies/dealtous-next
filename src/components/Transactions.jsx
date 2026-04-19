"use client";

import React, { useState, useEffect, useMemo } from "react";

import ProductStatsModal from "./ProductStatsModal";
import TransactionActionsModal from "./TransactionActionsModal";
import Preloader from "@/helper/Preloader";

import { useOrderTransactions } from "@/queries/transactions";

const TRANSACTION_STATUS = {
  PENDING: "Pending",
  PAYMENT_SECURED: "Payment Secured",
  IN_DISPUTE: "In Dispute",
  COMPLETED: "Completed",
  REFUNDED: "Refunded",
};

const Transactions = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filter, setFilter] = useState({
    status: "",
    timeRange: "",
    paymentMethod: "",
    amountRange: "",
  });

  const { status, timeRange, paymentMethod, amountRange } = filter;
  const ordersPerPage = 10;

  const { data: transactions, isPending } = useOrderTransactions();

  const mapToTransactionStatus = (status) => {
    switch (status) {
      // 🟡 Initial / waiting states
      case "PENDING":
      case "CAPTURED":
      case "CRYPTO_SUBMITTED":
      case "SELLER_TRANSFER_PENDING":
        return TRANSACTION_STATUS.PENDING;

      // 🔵 Payment secured (escrow locked)
      case "AUTHORIZED":
      case "PAYMENT_AUTHORIZED":
        return TRANSACTION_STATUS.PAYMENT_SECURED;

      // 🟢 Completed flow
      case "BUYER_CONFIRMED":
      case "RELEASE_READY":
      case "RELEASED":
        return TRANSACTION_STATUS.COMPLETED;

      // 🔴 Dispute
      case "DISPUTE":
        return TRANSACTION_STATUS.IN_DISPUTE;

      // ⚫ Refunded / Cancelled
      case "REFUNDED":
      case "CANCELLED":
        return TRANSACTION_STATUS.REFUNDED;

      default:
        return TRANSACTION_STATUS.PENDING;
    }
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

  const handleOpenModal = (type, order) => {
    setSelectedOrder(order);
    setTimeout(() => setActiveModal(type), 100);
  };

  const handleCloseTransactionModal = () => {
    setActiveModal(null);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredOrders = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((order) => {
      const matchedStatus = status
        ? mapToTransactionStatus(order.status) === status
        : true;

      const matchedPaymentMethod = paymentMethod
        ? order.paymentMethod === paymentMethod
        : true;

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

      let matchedAmount = true;

      if (amountRange) {
        const amount = Number(order.amount);

        if (amountRange.includes("+")) {
          const min = Number(amountRange.replace("+", ""));
          matchedAmount = amount >= min;
        } else {
          const [min, max] = amountRange.split("-").map(Number);
          matchedAmount = amount >= min && amount <= max;
        }
      }

      return (
        matchedStatus &&
        matchedPaymentMethod &&
        matchedTimeRange &&
        matchedAmount
      );
    });
  }, [transactions, status, timeRange, paymentMethod, amountRange]);

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
              <option value="Pending">Pending</option>
              <option value="Payment Secured">Payment Secured</option>
              <option value="In Dispute">In Dispute</option>
              <option value="Completed">Completed</option>
              <option value="Refunded">Refunded</option>
            </select>
            <select
              name="amountRange"
              className="form-select"
              value={amountRange}
              onChange={handleInputChange}
            >
              <option value="">All Amounts</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000+">$1000+</option>
            </select>
            <select
              name="paymentMethod"
              id="paymentMethod"
              className="form-select"
              value={paymentMethod}
              onChange={handleInputChange}
            >
              <option value="">All Methods</option>
              <option value="STRIPE">Card</option>
              <option value="CRYPTO">Crypto</option>
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
                  const displayStatus = mapToTransactionStatus(order.status);

                  return (
                    <tr key={order.id}>
                      <td>{indexOfFirstOrder + index + 1}</td>
                      <td>{order.product?.name || "Unknown"}</td>
                      <td>{order.buyer?.name || "Unknown"}</td>
                      <td>{order.seller?.name || "Unknown"}</td>
                      <td>${order.amount}</td>
                      <td>{displayStatus}</td>
                      <td>{order.payoutStatus}</td>
                      <td>
                        {order?.paymentMethod === "STRIPE" ? "CARD" : "CRYPTO"}
                      </td>
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
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedProduct(order.product);
                            setIsModalOpen(true);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleOpenModal("transaction", order)}
                        >
                          Manage
                        </button>
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

      {activeModal === "transaction" && selectedOrder && (
        <TransactionActionsModal
          selectedOrder={selectedOrder}
          activeModal={activeModal}
          handleCloseTransactionModal={handleCloseTransactionModal}
          mapToTransactionStatus={mapToTransactionStatus}
        />
      )}
    </>
  );
};

export default Transactions;
