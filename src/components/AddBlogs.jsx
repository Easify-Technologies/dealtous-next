"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Tiptap from "./TipTap";

import { useAddBlog } from "@/queries/add-blog";

const AddBlogs = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    images: [],
  });

  const { title, content, author, images } = formData;

  const { mutate, isPending, isSuccess, isError, data, error } = useAddBlog();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleCreateBlog = () => {
    const blogData = new FormData();

    blogData.append("title", title);
    blogData.append("content", content);
    blogData.append("author", author);

    images.forEach((file) => {
      blogData.append("images", file);
    });

    mutate(blogData, {
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/blogs");
        }, 2000);
      }
    });
  };

  return (
    <>
      <div className="dashboard-body__content">
        <div className="card common-card">
          <div className="card-body">
            <div className="card common-card border border-gray-five overflow-hidden mb-24">
              <div className="card-header">
                <h6 className="title">Add Blog</h6>
              </div>
              <div className="card-body">
                <div className="row gy-3">
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="common-input common-input--md border--color-dark bg--white"
                      id="title"
                      name="title"
                      value={title}
                      onChange={handleInputChange}
                      placeholder="Blog Title"
                    />
                  </div>
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="author" className="form-label">
                      Author
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      className="common-input common-input--md border--color-dark bg--white"
                      value={author}
                      onChange={handleInputChange}
                      placeholder="Author Name"
                    />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label">Upload Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="common-input"
                      onChange={handleImageChange}
                    />
                  </div>
                  <Tiptap
                    value={content}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, content: val }))
                    }
                  />
                  <div className="col-sm-12 col-xs-12">
                    {isSuccess && data.message && (
                      <p className="text-success mb-2">{data.message}</p>
                    )}

                    {isError && error && (
                      <p className="text-danger mb-2">{error.message}</p>
                    )}
                  </div>
                  <div className="col-sm-12 col-xs-12">
                    {/* SUBMIT */}
                    <button
                      disabled={isPending}
                      onClick={handleCreateBlog}
                      type="button"
                      className="btn btn-main w-100"
                    >
                      {isPending ? "Creating..." : "Create Blog"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBlogs;
