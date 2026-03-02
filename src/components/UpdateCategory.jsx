"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Preloader from "../helper/Preloader";
import { useFetchCategoryById } from "../queries/single-category";
import { useUpdateCategory } from "../queries/update-category";
import { useRemoveCategory } from "../queries/remove-category";

const UpdateCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    icon: "",
  });

  const { name, summary, icon } = formData;

  const categoryId = searchParams.get("category_id") || "";

  const { data: category, isLoading } = useFetchCategoryById(categoryId);
  const { mutate: updateCategory, isPending, isSuccess, isError, data, error } = useUpdateCategory();
  const { mutate: removeCategory } = useRemoveCategory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    updateCategory({ categoryId, ...formData }, {
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/categories");
        }, 2000);
      }
    });
  };

  const handleDelete = () => {
    removeCategory({ categoryId }, {
      onSuccess: (data) => {
        alert(data.message);
        setTimeout(() => {
          router.push("/admin/categories");
        }, 2000);
      }
    });
  };

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        summary: category.summary || "",
        icon: category.icon || "",
      });
    }
  }, [category]);

  if(isLoading) return <Preloader />

  return (
    <section className="padding-y-120">
      <div className="container">
        <h4 className="mb-4">Update Category</h4>

        <input
          className="common-input mb-3"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Category Name"
        />

        <input
          className="common-input mb-3"
          name="summary"
          value={summary}
          onChange={handleChange}
          placeholder="Summary"
        />

        <input
          className="common-input mb-3"
          name="icon"
          value={icon}
          onChange={handleChange}
          placeholder="Icon URL"
        />

        {isError && error && (
          <p className="text-danger mb-2">{error.message}</p>
        )}

        {isSuccess && data.message && (
          <p className="text-success mb-2">{data.message}</p>
        )}

        <button
          type="button"
          className="btn btn-main w-100 mb-2"
          onClick={handleUpdate}
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Category"}
        </button>

        <button
          type="button"
          className="btn btn-danger w-100"
          onClick={handleDelete}
        >
          Delete Category
        </button>
      </div>
    </section>
  );
};

export default UpdateCategory;
