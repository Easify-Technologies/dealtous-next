"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useFetchUserProducts } from "@/queries/fetch-user-products";
import Preloader from "@/helper/Preloader";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const { data: products, isPending } = useFetchUserProducts(userId);
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
        <Link href="/user/products/add" className="btn btn-sm btn-main">
          Add Product
        </Link>
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
              <th>Price</th>
              <th>Currency</th>
              <th>Subscribers</th>
              <th>Language</th>
              <th>Engagement Rate</th>
              <th>Posting Frequency</th>
              <th>Monetization Methods</th>
              <th>Average Views</th>
              <th>Status</th>
              <th>Image</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>

          <tbody className={isDarkMode ? "text-white" : "text-dark"}>
            {products?.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td className="fw-medium">{product.name}</td>
                  <td>{product.price}</td>
                  <td className="text-uppercase">{product.currency}</td>
                  <td>{product.subscribers}</td>
                  <td>{product.language}</td>
                  <td>{product.engagementRate}</td>
                  <td>{product.postingFrequency}</td>
                  <td>
                    {Array.isArray(product.monetizationMethods)
                      ? product.monetizationMethods.join(", ")
                      : product.monetizationMethods || "N/A"}
                  </td>
                  <td>{product.averageViews}</td>
                  <td>{product.isSold ? "SOLD" : product.status}</td>

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

                  <td className="text-end">
                    {product.isSold ? (
                      "No Action"
                    ) : (
                      <Link
                        href={`/user/products/update?product_id=${product.id}`}
                        className="btn btn-sm btn-main"
                      >
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center py-4 text-muted">
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

export default Page;
