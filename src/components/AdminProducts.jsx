"use client";

import Preloader from "../helper/Preloader";

import { useFetchProducts } from "../queries/fetch-products";

const AdminProducts = () => {
  const { data: products, isPending } = useFetchProducts();

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
        <table className="table table-hover align-middle">
          <thead className="table-light">
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
              <th className="text-end">Action</th>
            </tr>
          </thead>

          <tbody>
            {products?.length > 0 ? (
              products?.map((product) => {
                return (
                  <tr key={product?.id}>
                    <td className="fw-medium">{product?.name}</td>
                    <td>{product?.price}</td>
                    <td>{product?.summary}</td>
                    <td className="text-uppercase">{product?.currency}</td>
                    <td>{product?.subscribers}</td>
                    <td>{product?.language}</td>
                    <td>{product?.engagementRate}</td>
                    <td>{product?.postingFrequency}</td>
                    <td>{product?.monetizationMethods}</td>
                    <td>{product?.averageViews}</td>
                    <td>{product?.pincode}</td>
                    <td>{product?.status}</td>
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
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-main">Approve</button>
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
