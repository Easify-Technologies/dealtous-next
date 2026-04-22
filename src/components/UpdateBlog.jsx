"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tiptap from "./TipTap";

import imageCompression from "browser-image-compression";
import { useFetchBlogById } from "@/queries/fetch-blog";
import { useUpdateBlog } from "@/queries/update-blog";
import Preloader from "@/helper/Preloader";

const UpdateBlog = () => {
  const router = useRouter();

  const params = useSearchParams();

  const blogId = params.get("blog_id") ?? "";

  const { data: blog, isPending } = useFetchBlogById(blogId);
  const {
    mutate: updateBlog,
    isPending: updatePending,
    isSuccess,
    isError,
    data,
    error,
    reset,
  } = useUpdateBlog();

  const [formData, setFormData] = useState({
    title: "",
    metaTitle: "",
    metaDesc: "",
    content: "",
    author: "",
    images: [],
  });

  const { title, content, author, images, metaTitle, metaDesc } = formData;

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

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      fileType: "image/webp",
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    }
  };

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog?.title || "",
        metaTitle: blog?.metaTitle || "",
        metaDesc: blog?.metaDesc || "",
        author: blog?.author || "",
        content: blog?.content || "",
        images: blog?.images || [],
      });
    }
  }, [blog]);

  const handleUpdateBlog = async () => {
    const blogData = new FormData();

    blogData.append("blogId", blogId);
    blogData.append("title", title);
    blogData.append("content", content);
    blogData.append("author", author);
    blogData.append("metaTitle", metaTitle);
    blogData.append("metaDesc", metaDesc);

    const compressedImages = await Promise.all(
      images.map((file) => compressImage(file)),
    );

    compressedImages.forEach((file) => {
      blogData.append("images", file);
    });

    updateBlog(blogData, {
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/blogs");
        }, 2000);
      },
    });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        reset();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, reset]);

  if (isPending) return <Preloader />;

  return (
    <>
      <div className="dashboard-body__content">
        <div className="card common-card">
          <div className="card-body">
            <div className="card common-card border border-gray-five overflow-hidden mb-24">
              <div className="card-header">
                <h6 className="title">Update Blog</h6>
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
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="metaTitle" className="form-label">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      className="common-input common-input--md border--color-dark bg--white"
                      id="metaTitle"
                      name="metaTitle"
                      value={metaTitle}
                      onChange={handleInputChange}
                      placeholder="Meta Title"
                    />
                  </div>
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="metaDesc" className="form-label">
                      Meta Description
                    </label>
                    <input
                      type="text"
                      className="common-input common-input--md border--color-dark bg--white"
                      id="metaDesc"
                      name="metaDesc"
                      value={metaDesc}
                      onChange={handleInputChange}
                      placeholder="Meta Description"
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
                      disabled={updatePending}
                      onClick={handleUpdateBlog}
                      type="button"
                      className="btn btn-main w-100"
                    >
                      {updatePending ? "Updating..." : "Update Blog"}
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

export default UpdateBlog;
