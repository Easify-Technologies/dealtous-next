"use client";

import { useState, useEffect } from "react";
import Preloader from "@/helper/Preloader";

import { useFetchProducts } from "@/queries/fetch-products";
import { useVerifyProduct } from "@/queries/verify-product";
import { useCapturePayment } from "@/queries/capture-payment";
import { useReleaseFunds } from "@/queries/release-funds";

import { FaTrashCan } from "react-icons/fa6";
import { useRemoveProduct } from "@/queries/remove-product";

const AdminProducts = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [verifyingProductId, setVerifyingProductId] = useState(null);
  const [verifyCapture, setVerifyCapture] = useState(null);
  const [releasingOrderId, setReleasingOrderId] = useState(null);

  const { data: products, isPending } = useFetchProducts();
  const { mutate, isPending: verifyPending } = useVerifyProduct();
  const { mutate: capturePayment, isPending: capturePending } = useCapturePayment();
  const { mutate: releaseFunds, isPending: releasePending } = useReleaseFunds();
  const { mutate: removeProduct } = useRemoveProduct();

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

  const handleCapturePayment = (orderId) => {
    setVerifyCapture(orderId);

    capturePayment(orderId, {
      onSettled: () => {
        setVerifyCapture(null);
      },
    });
  };

  const handleReleaseFunds = (orderId) => {
    setReleasingOrderId(orderId);

    releaseFunds(orderId, {
      onSettled: () => {
        setReleasingOrderId(null);
      },
    });
  };

  const handleDeleteProduct = (productId) => {
    removeProduct(productId);
  }

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
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">All Products</h5>
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
              <th>Name</th>
              <th>Price</th>
              <th>Summary</th>
              <th>Currency</th>
              <th>Subscribers</th>
              <th>Language</th>
              <th>Engagement Rate</th>
              <th>Posting Frequency</th>
              <th>Monetization Methods</th>
              <th>Average Views</th>
              <th>Pincode</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Image</th>
              <th>Capture Payment</th>
              <th>Release Funds</th>
              <th>Approval</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
            {products?.length > 0 ? (
              products.map((product) => {
                const isPublishing =
                  verifyPending && verifyingProductId === product.id;

                const orderId = product.orders?.[0]?.id;

                const isCaptured = capturePending && verifyCapture === orderId;
                const isReleased = releasePending && releasingOrderId === orderId;

                return (
                  <tr key={product.id}>
                    <td className="fw-medium">{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.summary}</td>
                    <td className="text-uppercase">{product.currency}</td>
                    <td>{product.subscribers}</td>
                    <td>{product.language}</td>
                    <td>{product.engagementRate}</td>
                    <td>{product.postingFrequency}</td>
                    <td>{product.monetizationMethods}</td>
                    <td>{product.averageViews}</td>
                    <td>{product.pincode}</td>
                    <td>{product.status}</td>
                    <td>{product.orders?.[0]?.status || "No Orders"}</td>
                    {/* Image */}
                    <td>
                      {product?.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
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

                    {/* Capture Payment */}
                    <td>
                      {product.orders?.[0]?.status === "BUYER_CONFIRMED" ? (
                        <button
                          type="button"
                          disabled={isCaptured}
                          className="btn btn-main"
                          onClick={() => handleCapturePayment(orderId)}
                        >
                          {isCaptured ? "Capturing..." : "Capture"}
                        </button>
                      ) : (
                        "No Action"
                      )}
                    </td>

                    {/* Release Funds */}
                    <td>
                      {product.orders?.[0]?.status === "RELEASE_READY" ? (
                        <button
                          type="button"
                          disabled={
                            releasePending && releasingOrderId === orderId
                          }
                          className="btn btn-success"
                          onClick={() => handleReleaseFunds(orderId)}
                        >
                          {isReleased
                            ? "Releasing..."
                            : "Release"}
                        </button>
                      ) : (
                        "No Action"
                      )}
                    </td>

                    {/* Action */}
                    <td>
                      {product.status === "PUBLISHED" ? (
                        <button
                          type="button"
                          disabled
                          className="btn btn-secondary btn-sm"
                        >
                          Approved
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePublish(product.id)}
                            disabled={isPublishing}
                            type="button"
                            className="btn btn-sm btn-main me-2"
                          >
                            {isPublishing ? "Approving..." : "Approve"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product?.id)}>
                        <FaTrashCan size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="18" className="text-center py-4 text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
