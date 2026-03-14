"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Preloader from "@/helper/Preloader";
import { useFetchBuyerOrders } from "@/queries/buyer-orders";
import { useStartOnboardingProcess } from "@/queries/start-onboarding";
import { useBuyerConfirm } from "@/queries/buyer-confirm";
import { useFetchOnboardingDetails } from "@/queries/start-onboarding";

const page = () => {
  const [confirmingId, setConfirmingId] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.id ?? "";
  const userEmail = session?.user?.email ?? "";

  const { data: orders, isPending } = useFetchBuyerOrders(userId);
  const {
    mutate,
    isPending: confirmPending,
    isSuccess,
    isError,
    data,
    error,
  } = useBuyerConfirm();
  const { mutate: startOnboarding, isPending: startPending } =
    useStartOnboardingProcess();
  const { data: onboardDetails, isPending: onBoardPending } =
    useFetchOnboardingDetails(userEmail);

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

  const handleStartOnboarding = () => {
    startOnboarding(
      {
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
      },
      {
        onSuccess: (data) => {
          router.push(data.url);
        },
      },
    );
  };

  if (isPending) return <Preloader />;

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">All Orders</h5>
          <button
            disabled={startPending}
            type="button"
            className="btn btn-main btn-sm"
            onClick={handleStartOnboarding}
          >
            {startPending ? "Starting..." : "Start Onboarding"}
          </button>
        </div>

        {onboardDetails && (
          <div className="w-full pt-2">
            <div className="row">
              <div className="col-lg-6">
                <div className="card shadow-lg border-0 rounded-4">
                  <div className="card-header bg-primary text-white text-center rounded-top-4">
                    <h4 className="mb-0 text-white">Seller Dashboard</h4>
                  </div>

                  <div className="card-body p-4">
                    <div className="mb-3">
                      <span className="fw-bold text-muted">Name</span>
                      <p className="mb-0 fs-5">{onboardDetails?.seller?.name}</p>
                    </div>

                    <div className="mb-3">
                      <span className="fw-bold text-muted">Email</span>
                      <p className="mb-0 fs-5">{onboardDetails?.seller?.email}</p>
                    </div>

                    <div className="mb-3">
                      <span className="fw-bold text-muted">
                        Stripe Account ID
                      </span>
                      <p className="mb-0 fs-6 text-break">{onboardDetails?.account?.id}</p>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold">Charges Enabled</span>

                      <span
                      className={`badge ${
                        onboardDetails?.account?.charges_enabled ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {onboardDetails?.account?.charges_enabled ? "Enabled" : "Disabled"}
                    </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Payouts Enabled</span>

                      <span
                      className={`badge ${
                        onboardDetails?.account?.payouts_enabled ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {onboardDetails?.account?.payouts_enabled ? "Enabled" : "Disabled"}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        {confirmingId === order.id
                          ? "Confirming..."
                          : "Confirm Delivery"}
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
