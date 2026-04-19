"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Preloader from "@/helper/Preloader";
import { useFetchBlogs } from "@/queries/all-blogs";
import { useDeleteBlog } from "@/queries/delete-blog";
import { usePublishBlog } from "@/queries/publish-blog";

import { FaEye } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminBlogs = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const { data: blogs, isLoading } = useFetchBlogs();
  const { mutate: deleteBlog, isPending: removePending } = useDeleteBlog();
  const { mutate: publishBlog, isPending: publishPending } = usePublishBlog();

  const handleOpenModal = (type, blog) => {
    setSelectedBlog(blog);
    setTimeout(() => setActiveModal(type), 100);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => setSelectedBlog(null), 300);
  };

  const handleDeleteBlog = (blogId) => {
    deleteBlog(blogId);
  };

  const handlePublishBlog = (blogId) => {
    publishBlog({ blogId }, {
      onSuccess: (data) => {
        toast.success(data.message);
        router.refresh();
      },
      onError: (data) => {
        toast.error(data.error);
      }
    });
  };

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

  if (isLoading) return <Preloader />;

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">All Blogs</h5>
          <Link href="/admin/add-blog" className="btn btn-sm btn-main">
            Add Blogs
          </Link>
        </div>
        <span className="text-muted small">
          Total Blogs: {blogs?.length ?? 0}
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
                <th>Author</th>
                <th>Title</th>
                <th>Status</th>
                <th>Created At</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {blogs?.length > 0 ? (
                blogs.map((blog, index) => (
                  <tr key={blog.id}>
                    <td>{index + 1}</td>
                    <td>{blog.author}</td>
                    <td>{blog.title}</td>
                    <td>{blog.status}</td>
                    <td>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="d-flex align-items-center justify-content-end gap-2">
                      <button
                        type="button"
                        className="action-btn btn-primary-custom"
                        onClick={() => handleOpenModal("preview", blog)}
                      >
                        <FaEye size={20} />
                      </button>
                      <Link
                        href={`/admin/edit-blog?blog_id=${blog.id}`}
                        type="button"
                        className="action-btn btn-info-custom"
                      >
                        <FaPencilAlt size={20} />
                      </Link>
                      <button
                        type="button"
                        className="action-btn btn-danger-custom"
                        onClick={() => handleOpenModal("delete", blog)}
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No Blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {activeModal === "preview" && selectedBlog && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "preview" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${
              activeModal === "preview" ? "show d-block" : "d-block"
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
                    {selectedBlog?.title}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <p className="text-muted mb-2">
                    By {selectedBlog?.author} •{" "}
                    {new Date(selectedBlog?.createdAt).toDateString()}
                  </p>

                  {/* Featured Images */}
                  {selectedBlog?.images?.length > 0 && (
                    <img
                      src={selectedBlog?.images[0]}
                      className="img-fluid rounded mb-3"
                    />
                  )}

                  {/* Blog Content */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedBlog?.content,
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  {selectedBlog?.status === "Published" ? (
                    <button type="button" className="btn btn-success" disabled>
                      Already Published
                    </button>
                  ) : (
                    <button
                    type="button"
                    disabled={publishPending}
                    className="btn btn-success"
                    onClick={() => handlePublishBlog(selectedBlog?.id)}
                  >
                    {publishPending ? "Publishing..." : "Publish"}
                  </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {activeModal === "delete" && selectedBlog && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "delete" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${
              activeModal === "delete" ? "show d-block" : "d-block"
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
                    Delete this blog permanently?
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <p className="mb-2">
                    You are about to delete{" "}
                    <strong>{selectedBlog?.title}</strong>.
                  </p>

                  <p className="mb-0 text-muted small">
                    This action cannot be undone. All related blog details will
                    be removed permanently.
                  </p>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteBlog(selectedBlog?.id)}
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

export default AdminBlogs;
