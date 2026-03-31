"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Preloader from "@/helper/Preloader";
import { useFetchBlogs } from "@/queries/all-blogs";

const AdminBlogs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: blogs, isLoading } = useFetchBlogs();

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
                  <tr>
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
                    <td>No Action</td>
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
