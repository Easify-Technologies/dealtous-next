"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Preloader from "@/helper/Preloader";
import { useFetchBlogs } from "@/queries/all-blogs";
import { useDeleteBlog } from "@/queries/delete-blog";

import { FaEye } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";

const AdminBlogs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [viewingBlogId, setViewingBlogId] = useState(null);

  const { data: blogs, isLoading } = useFetchBlogs();
  const { mutate: deleteBlog } = useDeleteBlog();

  const handleDeleteBlog = (blogId) => {
    setDeletingBlogId(blogId);
    deleteBlog(blogId, {
      onSettled: () => {
        setDeletingBlogId(null);
      }
    });
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
                    <td>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="d-flex align-items-center justify-content-end gap-2">
                      <button type="button" className="action-btn btn-primary-custom">
                        <FaEye size={20} />
                      </button>
                      <button type="button" className="action-btn btn-danger-custom" disabled={deletingBlogId === blog.id} onClick={() => handleDeleteBlog(blog.id)}>
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
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

export default AdminBlogs;
