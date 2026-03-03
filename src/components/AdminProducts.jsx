"use client";

import Link from "next/link";
import Preloader from "../helper/Preloader";

import { useFetchProducts } from "../queries/fetch-products";

const AdminProducts = () => {
  const { data: products, isPending } = useFetchProducts();

  if(isPending) return <Preloader />

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">All Products</h5>
      </div>

      <span className="text-muted small">
        Total Products: {products?.length}
      </span>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Image</th>
            </tr>
          </thead>

          <tbody>
            {products?.length > 0 ? (
              products?.map((product) => {
                return (
                  <tr key={product?.id}>
                    <td className="fw-medium">{product?.name}</td>
                    <td>{product?.price}</td>
                    <td className="text-uppercase">{product?.currency}</td>
                    <td>
                      {product?.images?.[0] ? (
                        <img
                          src={product?.images[0]}
                          alt={product?.name}
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
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
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