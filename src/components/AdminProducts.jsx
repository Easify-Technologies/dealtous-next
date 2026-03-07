"use client";

import { useState, useEffect } from "react";
import Preloader from "@/helper/Preloader";

import { useFetchProducts } from "@/queries/fetch-products";
import { useVerifyProduct } from "@/queries/verify-product";

const AdminProducts = () => {
  const [verifyingProductId, setVerifyingProductId] = useState(null);

  const { data: products, isPending } = useFetchProducts();
  const { mutate, isPending: verifyPending } = useVerifyProduct();

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
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
            {products?.length > 0 ? (
              products.map((product) => {
                const isPublishing =
                  verifyPending && verifyingProductId === product.id;

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
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="14" className="text-center py-4 text-muted">
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
