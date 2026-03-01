"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Preloader from "../helper/Preloader";

const AdminProducts = () => {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">All Products</h5>
        <Link
          href="/admin/add-product"
          className="btn btn-sm btn-main"
        >
          Add Product
        </Link>
      </div>

      <span className="text-muted small">
        Total Products
      </span>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Image</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* {products.length > 0 ? (
              products.map((product) => {
                const lang = product.langs?.[0] || {};

                return (
                  <tr key={product.id}>
                    <td className="fw-medium">{lang.name}</td>
                    <td>{product.price}</td>
                    <td className="text-uppercase">{product.currency}</td>
                    <td>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={lang.name}
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
                      <Link
                        href={`/admin/update-product?product_id=${product.id}`}
                        className="btn btn-sm btn-main"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No products found.
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;