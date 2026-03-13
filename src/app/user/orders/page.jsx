"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Preloader from "@/helper/Preloader";
import { useFetchBuyerOrders } from "@/queries/buyer-orders";
import { useBuyerConfirm } from "@/queries/buyer-confirm";

const page = () => {
  const [confirmingId, setConfirmingId] = useState(null);
  const { data: session } = useSession();

  const userId = session?.user?.id ?? "";

  const { data: orders, isPending } = useFetchBuyerOrders(userId);
  const {
    mutate,
    isPending: confirmPending,
    isSuccess,
    isError,
    data,
    error,
  } = useBuyerConfirm();

  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleConfirmDelivery = (orderId) => {
    setConfirmingId(orderId);

    mutate(orderId, {
      onSettled: () => setConfirmingId(null),
    });
  };

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
                <th>Name</th>
                <th>Price</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Payout Status</th>
                <th>Image</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {orders &&
                orders?.map((order) => (
                  <tr key={order.id}>
                    <td>{order?.product?.name}</td>
                    <td>${order?.product?.price}</td>
                    <td>{order?.product?.currency}</td>
                    <td>{order?.status}</td>
                    <td>{order?.payoutStatus}</td>
                    <td>
                      {order?.images?.[0] ? (
                        <img
                          src={order.images[0]}
                          alt={order.name}
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
                    <td>
                      <button
                        onClick={() => handleConfirmDelivery(order.id)}
                        disabled={confirmingId === order.id}
                        type="button"
                        className="btn btn-main btn-sm"
                      >
                        {confirmingId === order.id ? "Confirming..." : "Confirm Delivery"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default page;
