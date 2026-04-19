"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { useCapturePayment } from "@/queries/capture-payment";
import { useReleaseFunds } from "@/queries/release-funds";
import { useVerifyCryptoPayment } from "@/queries/verify-crypto";
import { useReleaseCryptoPayment } from "@/queries/crypto-release";

const TransactionActionsModal = ({
  selectedOrder,
  activeModal,
  handleCloseTransactionModal,
  mapToTransactionStatus,
}) => {
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const { mutate: capturePayment } = useCapturePayment();
  const { mutate: releaseFunds } = useReleaseFunds();
  const { mutate: verifyCrypto } = useVerifyCryptoPayment();
  const { mutate: updateCryptoRelease } = useReleaseCryptoPayment();

  const orderStatus = mapToTransactionStatus(selectedOrder?.status);

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    const { type, orderId } = confirmAction;

    switch (type) {
      case "approveCrypto":
        handleVerifyCryptoPayment(orderId, "approve");
        break;

      case "rejectCrypto":
        handleVerifyCryptoPayment(orderId, "reject");
        break;

      case "capture":
        handleCapturePayment(orderId);
        break;

      case "cryptoRelease":
        handleCryptoReleaseReady(orderId);
        break;

      case "release":
        handleReleaseFunds(orderId);
        break;

      default:
        break;
    }

    setConfirmAction(null);
  };

  const handleVerifyCryptoPayment = (orderId, action) => {
    setActionLoading("verifyCrypto");

    verifyCrypto(
      { orderId, action },
      {
        onSuccess: () => {
          toast.success(
            action === "approve"
              ? "Crypto payment approved"
              : "Crypto payment rejected",
          );
          setTimeout(() => {
            handleCloseTransactionModal();
          }, 2000);
        },
        onError: () => {
          toast.error("Crypto verification failed");
        },
        onSettled: () => {
          setActionLoading(null);
        },
      },
    );
  };

  const handleCryptoReleaseReady = (orderId) => {
    setActionLoading("cryptoRelease");

    updateCryptoRelease(orderId, {
      onSuccess: () => {
        toast.success("Moved to release stage");
        setTimeout(() => {
          handleCloseTransactionModal();
        }, 2000);
      },
      onError: () => {
        toast.error("Failed to update release stage");
      },
      onSettled: () => {
        setActionLoading(null);
      },
    });
  };

  const handleCapturePayment = (orderId) => {
    setActionLoading("capture");

    capturePayment(orderId, {
      onSuccess: () => {
        toast.success("Payment captured successfully");
        setTimeout(() => {
          handleCloseTransactionModal();
        }, 2000);
      },
      onError: () => {
        toast.error("Failed to capture payment");
      },
      onSettled: () => {
        setActionLoading(null);
      },
    });
  };

  const handleReleaseFunds = (orderId) => {
    setActionLoading("release");

    releaseFunds(orderId, {
      onSuccess: () => {
        toast.success("Funds released successfully");
        setTimeout(() => {
          handleCloseTransactionModal();
        }, 2000);
      },
      onError: () => {
        toast.error("Failed to release funds");
      },
      onSettled: () => {
        setActionLoading(null);
      },
    });
  };

  if (!selectedOrder) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`modal-backdrop fade ${activeModal === "transaction" ? "show" : ""}`}
        onClick={handleCloseTransactionModal}
      />

      {/* Modal */}
      <div
        className={`modal fade ${activeModal === "transaction" ? "show d-block" : "d-block"}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <h4 className="modal-title fw-semibold">Manage Transaction</h4>
              <button
                className="btn-close"
                onClick={handleCloseTransactionModal}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <p>
                <strong>Buyer:</strong> {selectedOrder?.buyer?.name}
              </p>
              <p>
                <strong>Seller:</strong> {selectedOrder?.seller?.name}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedOrder?.amount}
              </p>
              <p>
                <strong>Status:</strong> {orderStatus}
              </p>
              <p>
                <strong>Payout Status:</strong> {selectedOrder?.payoutStatus}
              </p>
              <p>
                <strong>Method:</strong> {selectedOrder?.paymentMethod}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="modal-footer d-flex flex-wrap align-items-start">
              {confirmAction && (
                <div className="w-100 alert alert-warning mb-2">
                  <p className="mb-2 fw-semibold text-dark">
                    {confirmAction.type === "approveCrypto" &&
                      "You are about to APPROVE this crypto payment. This confirms the payment has been received and validated. This action cannot be undone."}

                    {confirmAction.type === "rejectCrypto" &&
                      "You are about to REJECT this crypto payment. This may trigger a refund or dispute process. This action cannot be undone."}

                    {confirmAction.type === "capture" &&
                      "You are about to CAPTURE this payment. The buyer will be charged and funds will be secured in escrow. This action cannot be reversed."}

                    {confirmAction.type === "cryptoRelease" &&
                      "You are moving this transaction to the RELEASE stage. Ensure the buyer has confirmed delivery before proceeding."}

                    {confirmAction.type === "release" &&
                      "You are about to RELEASE FUNDS to the seller. This will transfer money from escrow permanently and cannot be reversed."}
                  </p>

                  {/* Extra warning for critical action */}
                  {confirmAction.type === "release" && (
                    <p className="text-danger small fw-semibold mb-2">
                      ⚠️ Warning: This action is irreversible.
                    </p>
                  )}

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleConfirmAction}
                    >
                      Yes, Proceed
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setConfirmAction(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* 🔹 CRYPTO VERIFY */}
              {selectedOrder?.status === "CRYPTO_SUBMITTED" &&
                selectedOrder?.paymentMethod === "CRYPTO" && (
                  <>
                    <button
                      className="btn btn-sm m-0 me-2 btn-success"
                      disabled={
                        confirmAction !== null ||
                        actionLoading === "verifyCrypto"
                      }
                      onClick={() =>
                        setConfirmAction({
                          type: "approveCrypto",
                          orderId: selectedOrder?.id,
                        })
                      }
                    >
                      {actionLoading === "verifyCrypto"
                        ? "Processing..."
                        : "Confirm Payment"}
                    </button>

                    <button
                      className="btn btn-sm m-0 me-2 btn-danger"
                      disabled={
                        confirmAction !== null ||
                        actionLoading === "verifyCrypto"
                      }
                      onClick={() =>
                        setConfirmAction({
                          type: "rejectCrypto",
                          orderId: selectedOrder?.id,
                        })
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

              {/* 🔹 STRIPE CAPTURE */}
              {selectedOrder?.status === "BUYER_CONFIRMED" &&
                selectedOrder?.paymentMethod === "STRIPE" && (
                  <button
                    className="btn btn-sm m-0 me-2 btn-success"
                    disabled={
                      confirmAction !== null || actionLoading === "capture"
                    }
                    onClick={() =>
                      setConfirmAction({
                        type: "capture",
                        orderId: selectedOrder?.id,
                      })
                    }
                  >
                    {actionLoading === "capture"
                      ? "Processing..."
                      : "Capture Payment"}
                  </button>
                )}

              {/* 🔹 CRYPTO RELEASE READY */}
              {selectedOrder?.status === "BUYER_CONFIRMED" &&
                selectedOrder?.paymentMethod === "CRYPTO" && (
                  <button
                    className="btn btn-sm m-0 me-2 btn-info"
                    disabled={
                      confirmAction !== null ||
                      actionLoading === "cryptoRelease"
                    }
                    onClick={() =>
                      setConfirmAction({
                        type: "cryptoRelease",
                        orderId: selectedOrder?.id,
                      })
                    }
                  >
                    {actionLoading === "cryptoRelease"
                      ? "Processing..."
                      : "Move to Release"}
                  </button>
                )}

              {/* 🔹 RELEASE FUNDS */}
              {selectedOrder?.status === "RELEASE_READY" && (
                <button
                  className="btn btn-sm m-0 me-2 btn-primary"
                  disabled={
                    confirmAction !== null || actionLoading === "release"
                  }
                  onClick={() =>
                    setConfirmAction({
                      type: "release",
                      orderId: selectedOrder?.id,
                    })
                  }
                >
                  {actionLoading === "release"
                    ? "Processing..."
                    : "Release Funds"}
                </button>
              )}
              
              {/* CLOSE BUTTON */}
              <button
                className="btn btn-sm m-0 btn-secondary ms-auto"
                onClick={handleCloseTransactionModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionActionsModal;
