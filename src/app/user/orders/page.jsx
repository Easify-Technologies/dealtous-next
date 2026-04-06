"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Preloader from "@/helper/Preloader";
import { useFetchBuyerOrders } from "@/queries/buyer-orders";
import { useMarkTransferStatus } from "@/queries/seller-transfer";
import { useBuyerConfirm } from "@/queries/buyer-confirm";

const paymentStatus = {
  PAYMENT_AUTHORIZED: "Payment Secured",
  SELLER_TRANSFER_PENDING: "Waiting for Seller",
  CRYPTO_SUBMITTED: "Crypto Submitted",
  BUYER_CONFIRMED: "Delivery Confirmed",
  RELEASE_READY: "Payment Processing",
  RELEASED: "Payment Completed"
}

const page = () => {
  const { data: session } = useSession();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSellerId, setActiveSellerId] = useState(null);
  const [activeBuyerId, setActiveBuyerId] = useState(null);

  const userId = session?.user?.id ?? "";
  const role = session?.user?.role ?? "";

  const isBuyer = role === "Buyer";
  const isSeller = role === "Seller";

  const { data: orders, isPending } = useFetchBuyerOrders(userId);
  const { mutateAsync, isPending: markPending } = useMarkTransferStatus();
  const { mutateAsync: buyerConfirm, isPending: buyerPending } = useBuyerConfirm();

  const handleMarkTransfer = async (orderId) => {
    setActiveSellerId(orderId);
    
    try {
      await mutateAsync({ orderId });
    } catch (error) {
      console.error(error);
    } finally {
      setActiveSellerId(null);
    }
  };

  const handleBuyerConfirm = async (orderId) => {
    setActiveBuyerId(orderId);

    try {
      await buyerConfirm(orderId);
    } catch (error) {
      console.error(error);
    } finally {
      setActiveBuyerId(null);
    }
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
          <h5 className="mb-0">All Orders</h5>
        </div>

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
                <th>Payment Method</th>
                <th>Status</th>
                <th>Payout Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {orders.length > 0 ? (
                orders.map((order, index) => {
                  const isProcessing = activeSellerId === order.id;
                  const isBuyerProcessing = activeBuyerId === order.id;

                  return (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order?.product?.name}</td>
                      <td>${order?.product?.price}</td>
                      <td>{order?.product?.currency}</td>
                      <td>{order?.paymentMethod === "STRIPE" ? "CARD" : "CRYPTO"}</td>
                      <td>{paymentStatus[order?.status] || order?.status}</td>
                      <td>{order?.payoutStatus}</td>

                      <td className="d-flex gap-2 flex-wrap text-end">
                        {/* CRYPTO STATE */}
                        {order.status === "CRYPTO_SUBMITTED" ? (
                          <span className="text-muted text-end">
                            Waiting for verification
                          </span>
                        ) : (
                          <>
                            {/* SELLER FLOW */}
                            {isSeller &&
                              (order.status === "PAYMENT_AUTHORIZED" ||
                                order.status === "SELLER_TRANSFER_PENDING" ||
                                order.status === "BUYER_CONFIRMED") && (
                                <button
                                  type="button"
                                  className="btn btn-main"
                                  disabled={
                                    isProcessing ||
                                    order.status ===
                                      "SELLER_TRANSFER_PENDING" ||
                                    order.status === "BUYER_CONFIRMED"
                                  }
                                  onClick={() => handleMarkTransfer(order.id)}
                                >
                                  {order.status === "SELLER_TRANSFER_PENDING" ||
                                  order.status === "BUYER_CONFIRMED"
                                    ? "Marked"
                                    : isProcessing
                                      ? "Marking..."
                                      : "Mark Transfer"}
                                </button>
                              )}

                            {/* NO ACTION */}
                            {!(
                              (isSeller &&
                                (order.status === "PAYMENT_AUTHORIZED" ||
                                  order.status === "SELLER_TRANSFER_PENDING" ||
                                  order.status === "BUYER_CONFIRMED")) ||
                              (isBuyer &&
                                (order.status === "SELLER_TRANSFER_PENDING" ||
                                  order.status === "BUYER_CONFIRMED"))
                            ) && <span className="text-muted text-end">No Action</span>}
                          </>
                        )}

                        {/* BUYER FLOW (separate, NOT inside fragment above) */}
                        {isBuyer &&
                          (order.status === "SELLER_TRANSFER_PENDING" ||
                            order.status === "BUYER_CONFIRMED") && (
                            <button
                              type="button"
                              className="btn btn-main"
                              disabled={
                                isBuyerProcessing ||
                                order.status === "BUYER_CONFIRMED"
                              }
                              onClick={() => handleBuyerConfirm(order.id)}
                            >
                              {order.status === "BUYER_CONFIRMED"
                                ? "Confirmed"
                                : isBuyerProcessing
                                  ? "Confirming..."
                                  : "Confirm Delivery"}
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No Orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default page;
