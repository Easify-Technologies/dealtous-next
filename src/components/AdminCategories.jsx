"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import Preloader from "@/helper/Preloader";
import { useFetchCategories } from "@/queries/fetch-categories";
import { useRemoveCategory } from "@/queries/remove-category";

const AdminCategories = () => {
  const { data: categories, isPending } = useFetchCategories();
  const { mutate, isPending: removePending } = useRemoveCategory();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenDeleteModal = (category) => {
    setDeleteCategory(category);
    setTimeout(() => setShowDeleteModal(true), 10);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);

    setTimeout(() => {
      setDeleteCategory(null);
    }, 300);
  };

  const handleConfirmDelete = () => {
    if (!deleteCategory) return;

    mutate(
      { categoryId: deleteCategory.id },
      {
        onSuccess: () => {
          toast.success("Category deleted successfully.");
          handleCloseDeleteModal();
        },
        onError: () => {
          toast.error("Failed to delete category. Please try again.");
        },
      },
    );
  };

  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    return categories?.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  useEffect(() => {
    if (deleteCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [deleteCategory]);

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
            <Link
              href="/admin/add-category"
              className="btn btn-sm btn-main"
              style={{ width: "165px" }}
            >
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

                      <td className="d-flex align-items-center justify-content-end gap-2">
                        <Link
                          href={`/admin/update-category?category_id=${category.id}`}
                          className="btn btn-sm btn-main"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleOpenDeleteModal(category)}
                        >
                          Delete
                        </button>
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

      {/* Delete Confirmation Modal */}
      {deleteCategory && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${showDeleteModal ? "show" : ""}`}
            onClick={handleCloseDeleteModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${
              showDeleteModal ? "show d-block" : "d-block"
            }`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    Delete this category permanently?
                  </h5>
                  <button
                    className="btn-close"
                    onClick={handleCloseDeleteModal}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <p className="mb-2">
                    You are about to delete{" "}
                    <strong>{deleteCategory.name}</strong>.
                  </p>

                  <p className="mb-0 text-muted small">
                    This action cannot be undone. All related product details
                    and listing data will be removed permanently.
                  </p>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCloseDeleteModal}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                    disabled={removePending}
                  >
                    {removePending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminCategories;
