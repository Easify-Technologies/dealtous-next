"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import Preloader from "@/helper/Preloader";
import { useFetchCategories } from "@/queries/fetch-categories";

const AdminCategories = () => {
  const { data: categories, isPending } = useFetchCategories();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = useMemo(() => {
    if(!categories) return [];

    return categories?.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categories, searchTerm]);

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
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">All Categories</h5>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control"
              name="searchTerm"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search Categories..."
            />
            <Link href="/admin/add-category" className="btn btn-sm btn-main" style={{ width: "165px" }}>
              Add Category
            </Link>
          </div>
        </div>
        <span className="text-muted small">
          Total Categories: {categories.length}
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
                <th>Summary</th>
                <th>Icon</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {filteredCategories?.length > 0 ? (
                filteredCategories?.map((category) => {
                  return (
                    <tr key={category.id}>
                      <td className="fw-medium">
                        {category.name || "Unnamed"}
                      </td>

                      <td>{category.summary}</td>

                      <td>
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
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
