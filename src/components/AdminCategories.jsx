"use client";

import Link from "next/link";
import Preloader from "../helper/Preloader";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_CATEGORIES } from "../graphql/queries";

const PAGE_SIZE = 9;

const AdminCategories = () => {
  const { data, loading, error } = useQuery(GET_ADMIN_CATEGORIES, {
    variables: {
      offset: 0,
      length: PAGE_SIZE,
    },
    fetchPolicy: "network-only",
  });

  if (loading) return <Preloader />;
  if (error) return <p>Error: {error.message}</p>;

  const categories = data?.categories?.results || [];
  const total = data?.categories?.total ?? 0;

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">All Categories</h5>
          <Link href="/admin/add-category" className="btn btn-sm btn-main">
            Add Category
          </Link>
        </div>
        <span className="text-muted small">
          Total Categories: {total}
        </span>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Parent</th>
                <th>Icon</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {categories?.length > 0 ? (
                categories.map((category) => {
                  const lang = category.langs?.[0] || {};

                  return (
                    <tr key={category.id}>
                      <td className="fw-medium">{lang.name || "Unnamed"}</td>

                      <td>{category.parent?.langs?.[0]?.name || "Root"}</td>

                      <td>
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={lang.name || "category"}
                            className="img-fluid rounded"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span className="text-muted small">No Icon</span>
                        )}
                      </td>

                      <td className="text-end">
                        <Link
                          href={`/admin/update-category?category_id=${category.id}`}
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
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No categories found.
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

export default AdminCategories;
